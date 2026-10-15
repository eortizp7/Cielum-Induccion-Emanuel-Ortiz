const { Router } = require('express');
const pool = require('../db');
const { requiereToken } = require('../autenticacion');

const router = Router();
router.use(requiereToken);

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

// Error "esperado" (cliente inexistente, sin stock...) con su código HTTP
class ErrorNegocio extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

function entero(valor) {
  return Number.isInteger(valor) && valor > 0 && valor <= 2147483647;
}

function validarPedido({ cliente_id, items, notas }) {
  if (!entero(cliente_id)) return 'cliente_id debe ser un entero positivo';
  if (notas !== undefined && (typeof notas !== 'string' || notas.length > 255)) {
    return 'notas debe ser texto de hasta 255 caracteres';
  }
  if (!Array.isArray(items) || items.length === 0) {
    return 'items debe ser una lista con al menos un producto';
  }
  const vistos = new Set();
  for (const item of items) {
    if (!item || !entero(item.producto_id) || !entero(item.cantidad)) {
      return 'Cada item necesita producto_id y cantidad enteros positivos';
    }
    if (vistos.has(item.producto_id)) return `El producto ${item.producto_id} está repetido`;
    vistos.add(item.producto_id);
  }
  return null;
}

// Crear pedido con detalle: todo o nada
router.post('/', async (req, res) => {
  const cuerpo = req.body || {};
  const error = validarPedido(cuerpo);
  if (error) return res.status(400).json({ error });

  const { cliente_id, notas = null } = cuerpo;
  // Orden fijo por producto: evita bloqueos cruzados entre pedidos simultáneos
  const items = [...cuerpo.items].sort((a, b) => a.producto_id - b.producto_id);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cliente = await client.query(
      'SELECT id FROM clientes WHERE id = $1 AND activo = true', [cliente_id]
    );
    if (cliente.rowCount === 0) throw new ErrorNegocio(404, 'Cliente no encontrado');

    const pedido = await client.query(
      `INSERT INTO pedidos (cliente_id, notas) VALUES ($1, $2)
       RETURNING id, cliente_id, estado, fecha_pedido, notas`,
      [cliente_id, notas]
    );
    const pedidoId = pedido.rows[0].id;

    const detalle = [];
    for (const { producto_id, cantidad } of items) {
      // Descuenta solo si alcanza: la condición y el descuento son una sola operación
      const descuento = await client.query(
        `UPDATE productos SET stock = stock - $1
         WHERE id = $2 AND activo = true AND stock >= $1
         RETURNING precio::float AS precio`,
        [cantidad, producto_id]
      );
      if (descuento.rowCount === 0) {
        const existe = await client.query(
          'SELECT stock FROM productos WHERE id = $1 AND activo = true', [producto_id]
        );
        if (existe.rowCount === 0) {
          throw new ErrorNegocio(404, `El producto ${producto_id} no existe`);
        }
        throw new ErrorNegocio(
          409,
          `Stock insuficiente para el producto ${producto_id} (disponible: ${existe.rows[0].stock})`
        );
      }
      const precio = descuento.rows[0].precio;
      await client.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, producto_id, cantidad, precio]
      );
      detalle.push({ producto_id, cantidad, precio_unitario: precio });
    }

    await client.query('COMMIT');
    const total = detalle.reduce((suma, d) => suma + d.cantidad * d.precio_unitario, 0);
    res.status(201).json({
      ...pedido.rows[0],
      total: Math.round(total * 100) / 100,
      items: detalle,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof ErrorNegocio) return res.status(err.status).json({ error: err.message });
    throw err;
  } finally {
    client.release();
  }
});

// Listar con filtro y paginación: /pedidos?estado=pendiente&pagina=1&limite=10
router.get('/', async (req, res) => {
  const { estado } = req.query;
  const pagina = req.query.pagina === undefined ? 1 : Number(req.query.pagina);
  const limite = req.query.limite === undefined ? 10 : Number(req.query.limite);

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS.join(', ')}` });
  }
  if (!Number.isInteger(pagina) || pagina < 1) {
    return res.status(400).json({ error: 'pagina debe ser un entero mayor o igual a 1' });
  }
  if (!Number.isInteger(limite) || limite < 1 || limite > 100) {
    return res.status(400).json({ error: 'limite debe ser un entero entre 1 y 100' });
  }

  const filtro = estado ?? null;
  const conteo = await pool.query(
    'SELECT COUNT(*) AS n FROM pedidos WHERE ($1::text IS NULL OR estado = $1)', [filtro]
  );
  const totalRegistros = Number(conteo.rows[0].n);

  const { rows } = await pool.query(
    `SELECT p.id, p.cliente_id, c.nombre AS cliente, p.estado, p.fecha_pedido,
            COALESCE(t.total, 0)::float AS total
     FROM pedidos p
     JOIN clientes c ON c.id = p.cliente_id
     LEFT JOIN v_pedido_totales t ON t.pedido_id = p.id
     WHERE ($1::text IS NULL OR p.estado = $1)
     ORDER BY p.id DESC
     LIMIT $2 OFFSET $3`,
    [filtro, limite, (pagina - 1) * limite]
  );

  res.json({
    datos: rows,
    pagina,
    limite,
    total_registros: totalRegistros,
    paginas: Math.ceil(totalRegistros / limite),
  });
});

// Un pedido con su detalle
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!entero(id)) return res.status(404).json({ error: 'Pedido no encontrado' });

  const pedido = await pool.query(
    `SELECT p.id, p.cliente_id, c.nombre AS cliente, p.estado, p.fecha_pedido, p.notas
     FROM pedidos p JOIN clientes c ON c.id = p.cliente_id
     WHERE p.id = $1`,
    [id]
  );
  if (pedido.rowCount === 0) return res.status(404).json({ error: 'Pedido no encontrado' });

  const items = await pool.query(
    `SELECT d.producto_id, pr.nombre AS producto, d.cantidad,
            d.precio_unitario::float AS precio_unitario
     FROM detalle_pedido d JOIN productos pr ON pr.id = d.producto_id
     WHERE d.pedido_id = $1 ORDER BY d.id`,
    [id]
  );
  const total = items.rows.reduce((suma, i) => suma + i.cantidad * i.precio_unitario, 0);
  res.json({ ...pedido.rows[0], total: Math.round(total * 100) / 100, items: items.rows });
});

// Cambiar el estado de un pedido: PATCH /pedidos/:id/estado  { "estado": "pagado" }
router.patch('/:id/estado', async (req, res) => {
  const id = Number(req.params.id);
  if (!entero(id)) return res.status(404).json({ error: 'Pedido no encontrado' });

  const { estado } = req.body || {};
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS.join(', ')}` });
  }

  const { rows } = await pool.query(
    `UPDATE pedidos SET estado = $1 WHERE id = $2
     RETURNING id, cliente_id, estado, fecha_pedido, notas`,
    [estado, id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(rows[0]);
});

module.exports = router;
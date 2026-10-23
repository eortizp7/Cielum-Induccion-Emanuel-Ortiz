// Ejercicio avanzado · Día 7
// El mismo CRUD de productos, ahora en PostgreSQL (tabla productos de la tienda) con:
//   - pg: pool de conexiones y consultas parametrizadas ($1, $2...)
//   - zod: validación de la entrada con un esquema
//   - un middleware de errores centralizado
// Correr: copiar .env.example a .env, llenar DB_PASSWORD y  npm run avanzado   (puerto 4002)
// Necesita el Postgres del proyecto encendido: en proyecto/ -> docker compose up -d postgres

require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { z } = require('zod');

// ---------- Conexión: un pool reutiliza conexiones en vez de abrir una por consulta ----------
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'tienda',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// ---------- Esquemas de validación (zod) ----------
const esquemaProducto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  precio: z.number().nonnegative('El precio debe ser mayor o igual a 0'),
  stock: z.number().int().nonnegative('El stock debe ser un entero mayor o igual a 0').default(0),
  categoria_id: z.number().int().positive().default(1),
  sku: z.string({ error: 'El sku es obligatorio' }).trim().min(1, 'El sku es obligatorio').max(30),
});
// El id llega en la URL como texto: coerce lo convierte a número antes de validarlo
const esquemaParams = z.object({
  id: z.coerce.number({ error: 'El id debe ser un número' }).int().positive().max(2147483647),
});

// Error con código HTTP, para que el middleware sepa qué responder
class ErrorHttp extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

// Valida con zod y, si falla, lanza un 400 con la lista de problemas
function validar(esquema, datos) {
  const resultado = esquema.safeParse(datos);
  if (!resultado.success) {
    const detalles = resultado.error.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message }));
    throw new ErrorHttp(400, 'Datos inválidos', detalles);
  }
  return resultado.data;
}

const COLUMNAS = 'id, categoria_id, sku, nombre, precio::float AS precio, stock';

const app = express();
app.use(express.json());

// ---------- Rutas ----------
// Express 5: si una función async lanza un error, llega sola al middleware de errores (sin try/catch)
app.get('/productos', async (req, res) => {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE activo ORDER BY id`);
  res.json(rows);
});

app.get('/productos/:id', async (req, res) => {
  const { id } = validar(esquemaParams, req.params);
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE id = $1 AND activo`, [id]);
  if (rows.length === 0) throw new ErrorHttp(404, 'Producto no encontrado');
  res.json(rows[0]);
});

app.post('/productos', async (req, res) => {
  const p = validar(esquemaProducto, req.body ?? {});
  const { rows } = await pool.query(
    `INSERT INTO productos (categoria_id, sku, nombre, precio, stock)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${COLUMNAS}`,
    [p.categoria_id, p.sku, p.nombre, p.precio, p.stock]
  );
  res.status(201).json(rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  const { id } = validar(esquemaParams, req.params);
  const p = validar(esquemaProducto.omit({ sku: true, categoria_id: true }), req.body ?? {});
  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, precio = $2, stock = $3
     WHERE id = $4 AND activo RETURNING ${COLUMNAS}`,
    [p.nombre, p.precio, p.stock, id]
  );
  if (rows.length === 0) throw new ErrorHttp(404, 'Producto no encontrado');
  res.json(rows[0]);
});

// Borrado lógico: el producto puede estar en pedidos viejos
app.delete('/productos/:id', async (req, res) => {
  const { id } = validar(esquemaParams, req.params);
  const { rowCount } = await pool.query('UPDATE productos SET activo = false WHERE id = $1 AND activo', [id]);
  if (rowCount === 0) throw new ErrorHttp(404, 'Producto no encontrado');
  res.status(204).send();
});

// ---------- Middleware de errores centralizado (siempre al final y con 4 parámetros) ----------
app.use((err, req, res, next) => {
  if (err instanceof ErrorHttp) {
    return res.status(err.status).json({ error: err.message, detalles: err.detalles });
  }
  if (err.type === 'entity.parse.failed') {                 // body con JSON mal escrito
    return res.status(400).json({ error: 'El cuerpo no es un JSON válido' });
  }
  if (err.code === '23505') return res.status(409).json({ error: 'Ya existe un producto con ese SKU' });
  if (err.code === '23503') return res.status(400).json({ error: 'La categoría no existe' });

  console.error(err);                                          // el detalle queda en el log del servidor
  res.status(500).json({ error: 'Error interno del servidor' }); // al cliente nunca se le muestra
});

const PUERTO = process.env.PORT || 4002;
app.listen(PUERTO, () => console.log(`Avanzado escuchando en http://localhost:${PUERTO}`));

const { Router } = require('express');
const { randomUUID } = require('crypto');
const pool = require('../db');
const { requiereToken } = require('../autenticacion');

const router = Router();
// precio::float lo devuelve como número (numeric llega como texto)
const COLUMNAS = 'id, categoria_id, sku, nombre, precio::float AS precio, stock';

function idValido(texto) {
  const id = Number(texto);
  return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

function validar({ nombre, precio, stock }) {
  if (typeof nombre !== 'string' || nombre.trim() === '') return 'El nombre es obligatorio';
  if (typeof precio !== 'number' || precio < 0) return 'El precio debe ser un número mayor o igual a 0';
  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) return 'El stock debe ser un entero mayor o igual a 0';
  return null;
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM productos WHERE activo = true ORDER BY id`
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const id = idValido(req.params.id);
  if (id === null) return res.status(404).json({ error: 'Producto no encontrado' });
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM productos WHERE id = $1 AND activo = true`, [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(rows[0]);
});

router.post('/', requiereToken, async (req, res) => {
  const cuerpo = req.body || {};
  const error = validar(cuerpo);
  if (error) return res.status(400).json({ error });

  const {
    nombre, precio, stock = 0, categoria_id = 1,
    sku = `API-${randomUUID().slice(0, 8).toUpperCase()}`,
  } = cuerpo;

  try {
    const { rows } = await pool.query(
      `INSERT INTO productos (categoria_id, sku, nombre, precio, stock)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${COLUMNAS}`,
      [categoria_id, sku, nombre.trim(), precio, stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ya existe un producto con ese SKU' });
    if (err.code === '23503') return res.status(400).json({ error: 'La categoría no existe' });
    throw err;
  }
});

router.put('/:id', requiereToken, async (req, res) => {
  const id = idValido(req.params.id);
  if (id === null) return res.status(404).json({ error: 'Producto no encontrado' });
  const cuerpo = req.body || {};
  const error = validar(cuerpo);
  if (error) return res.status(400).json({ error });

  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, precio = $2, stock = COALESCE($3, stock)
     WHERE id = $4 AND activo = true RETURNING ${COLUMNAS}`,
    [cuerpo.nombre.trim(), cuerpo.precio, cuerpo.stock ?? null, id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(rows[0]);
});

// Borrado lógico: el producto puede tener pedidos asociados
router.delete('/:id', requiereToken, async (req, res) => {
  const id = idValido(req.params.id);
  if (id === null) return res.status(404).json({ error: 'Producto no encontrado' });
  const resultado = await pool.query(
    'UPDATE productos SET activo = false WHERE id = $1 AND activo = true', [id]
  );
  if (resultado.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.status(204).send();
});

module.exports = router;
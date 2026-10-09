const { Router } = require('express');
const pool = require('../db');
const { requiereToken } = require('../autenticacion');

const router = Router();
const COLUMNAS = 'id, nombre, email, telefono, ciudad';

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM clientes WHERE activo = true ORDER BY id`
  );
  res.json(rows);
});

router.post('/', requiereToken, async (req, res) => {
  const { nombre, email, telefono = null, ciudad = null } = req.body || {};
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'El email no es válido' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono, ciudad)
       VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
      [nombre.trim(), email.trim(), telefono, ciudad]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ya existe un cliente con ese email' });
    throw err;
  }
});

module.exports = router;
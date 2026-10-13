const { Router } = require('express');
const { crearToken } = require('../autenticacion');

function login(req, res) {
  const { usuario, clave } = req.body || {};
  if (typeof usuario !== 'string' || typeof clave !== 'string') {
    return res.status(400).json({ error: 'usuario y clave son obligatorios' });
  }
  if (usuario !== process.env.ADMIN_USUARIO || clave !== process.env.ADMIN_CLAVE) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  res.json({
    token: crearToken(usuario),
    tipo: 'Bearer',
    expira_en: process.env.JWT_EXPIRA || '1h',
  });
}

const router = Router();
router.post('/login', login);

module.exports = { router, login };
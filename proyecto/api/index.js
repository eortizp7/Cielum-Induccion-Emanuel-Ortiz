require('dotenv').config();
const express = require('express');
const { USUARIO, TOKEN } = require('./autenticacion');
const productos = require('./rutas/productos');
const clientes = require('./rutas/clientes');

const app = express();
app.use(express.json());

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date() });
});

app.post('/login', (req, res) => {
  const { usuario, clave } = req.body || {};
  if (usuario !== USUARIO.usuario || clave !== USUARIO.clave) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  res.json({ token: TOKEN });
});

app.use('/productos', productos);
app.use('/clientes', clientes);

// Manejo de errores: nunca se exponen detalles internos
app.use((err, req, res, next) => {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: 'Solicitud inválida' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => console.log(`API escuchando en http://localhost:${PUERTO}`));
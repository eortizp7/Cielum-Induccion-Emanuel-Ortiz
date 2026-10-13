require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./rutas/auth');
const productos = require('./rutas/productos');
const clientes = require('./rutas/clientes');
const pedidos = require('./rutas/pedidos');

// Sin estas variables la API no puede funcionar bien: mejor fallar al arrancar
for (const nombre of ['JWT_SECRET', 'ADMIN_USUARIO', 'ADMIN_CLAVE']) {
  if (!process.env[nombre]) {
    console.error(`Falta la variable ${nombre} en el .env`);
    process.exit(1);
  }
}

const app = express();

const origenes = (process.env.CORS_ORIGENES || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: origenes }));
app.use(express.json());

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date() });
});

app.use('/auth', auth.router);
// Ruta antigua: se quita cuando la colección de Postman use /auth/login
app.post('/login', auth.login);

app.use('/productos', productos);
app.use('/clientes', clientes);
app.use('/pedidos', pedidos);

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
// Ejercicio básico · Día 7
// Servidor Express con una sola ruta: GET /salud -> { estado: "ok", fecha }
// Correr: npm run basico   y abrir http://localhost:4000/salud

const express = require('express');

const app = express();

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date() });
});

const PUERTO = process.env.PORT || 4000;
app.listen(PUERTO, () => console.log(`Básico escuchando en http://localhost:${PUERTO}`));

const express = require('express');

const app = express();
app.use(express.json());

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date() });
});

// "Base de datos" en memoria: se borra al reiniciar servidor. 
let productos = [
  { id: 1, nombre: 'Taladro percutor', precio: 185000, stock: 12 },
  { id: 2, nombre: 'Pulidora angular', precio: 142000, stock: 8 },
];
let siguienteId = 3; 

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.get('/productos/:id', (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(producto);
});

app.post('/productos', requiereToken, (req, res) => {
  const { nombre, precio, stock = 0 } = req.body;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'nombre es obligatorio' });
  }
  if (typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'precio debe ser un número mayor a 0' });
  }

  const nuevo = { id: siguienteId++, nombre, precio, stock };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put('/productos/:id', requiereToken, (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const { nombre, precio, stock } = req.body;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'nombre es obligatorio' });
  }
  if (typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'precio debe ser un número mayor a 0' });
  }

  producto.nombre = nombre;
  producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;
  res.json(producto);
});

app.delete('/productos/:id', requiereToken, (req, res) => {
  const indice = productos.findIndex((p) => p.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  productos.splice(indice, 1);
  res.status(204).send();
});

// Usuario fijo de prueba (solo para la inducción, nunca así en producción)
const USUARIO = { usuario: 'admin', clave: 'admin123' };
const TOKEN = 'token-de-prueba-123';

app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;

  if (usuario !== USUARIO.usuario || clave !== USUARIO.clave) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  res.json({ token: TOKEN });
});

// Middleware: deja pasar solo si viene el token correcto
function requiereToken(req, res, next) {
  const cabecera = req.headers.authorization || '';
  if (cabecera !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'Token faltante o inválido' });
  }
  next();
}

app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000');
});
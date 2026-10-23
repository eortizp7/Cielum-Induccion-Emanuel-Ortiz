// Ejercicio intermedio · Día 7
// CRUD de productos guardado en memoria (un arreglo). Al reiniciar el servidor se pierde todo.
// Correr: npm run intermedio   (puerto 4001)

const express = require('express');

const app = express();
app.use(express.json()); // convierte el body JSON en objeto (req.body)

// "Base de datos" en memoria
let productos = [
  { id: 1, nombre: 'Taladro percutor', precio: 185000, stock: 12 },
  { id: 2, nombre: 'Pulidora angular', precio: 142000, stock: 8 },
];
let siguienteId = 3;

function validar({ nombre, precio, stock }) {
  if (typeof nombre !== 'string' || nombre.trim() === '') return 'nombre es obligatorio';
  if (typeof precio !== 'number' || precio <= 0) return 'precio debe ser un número mayor a 0';
  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) return 'stock debe ser un entero mayor o igual a 0';
  return null;
}

// Listar
app.get('/productos', (req, res) => {
  res.json(productos);
});

// Consultar uno
app.get('/productos/:id', (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// Crear
app.post('/productos', (req, res) => {
  const error = validar(req.body || {});
  if (error) return res.status(400).json({ error });

  const { nombre, precio, stock = 0 } = req.body;
  const nuevo = { id: siguienteId++, nombre: nombre.trim(), precio, stock };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// Actualizar
app.put('/productos/:id', (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const error = validar(req.body || {});
  if (error) return res.status(400).json({ error });

  const { nombre, precio, stock } = req.body;
  producto.nombre = nombre.trim();
  producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;
  res.json(producto);
});

// Eliminar
app.delete('/productos/:id', (req, res) => {
  const indice = productos.findIndex((p) => p.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  productos.splice(indice, 1);
  res.status(204).send(); // 204: salió bien y no hay nada que devolver
});

const PUERTO = process.env.PORT || 4001;
app.listen(PUERTO, () => console.log(`Intermedio escuchando en http://localhost:${PUERTO}`));

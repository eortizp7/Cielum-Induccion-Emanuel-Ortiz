
INSERT INTO categorias (nombre) VALUES
  ('Hogar'),
  ('Tecnología'),
  ('Deportes'),
  ('Papelería'),
  ('Mascotas');

INSERT INTO clientes (nombre, email, telefono, ciudad, activo) VALUES
  ('Ana Gómez',    'ana.gomez@correo.com',    '3001112233', 'Medellín',     'true'),
  ('Luis Pérez',   'luis.perez@correo.com',   '3012223344', 'Bogotá',       'true'),
  ('Marta Ríos',   'marta.rios@correo.com',   '3023334455', 'Cali',         'true'),
  ('Pedro Solano', 'pedro.solano@correo.com', NULL,         'Medellín',     'true'),
  ('Carla Ruiz',   'carla.ruiz@correo.com',   '3045556677', 'Barranquilla', 'true'),
  ('Jorge Díaz',   'jorge.diaz@correo.com',   '3056667788', 'Bogotá',       'true'),
  ('Sofía Mejía',  'sofia.mejia@correo.com',  '3067778899', 'Cali',         'false'),
  ('Daniel Cano',  'daniel.cano@correo.com',  '3078889900', 'Medellín',     'true');

INSERT INTO productos (categoria_id, sku, nombre, precio, stock, activo) VALUES
  (1, 'HOG-001', 'Lámpara LED de mesa',   45000,  20, 'true'),
  (1, 'HOG-002', 'Juego de sábanas',     120000,  15, 'true'),
  (2, 'TEC-001', 'Audífonos Bluetooth',   89000,  30, 'true'),
  (2, 'TEC-002', 'Cargador portátil',     65000,   0, 'true'),
  (2, 'TEC-003', 'Mouse inalámbrico',     38000,  25, 'true'),
  (3, 'DEP-001', 'Balón de fútbol',       55000,  12, 'true'),
  (3, 'DEP-002', 'Cuerda para saltar',    18000,  40, 'true'),
  (3, 'DEP-003', 'Botella térmica',       42000,  18, 'false'),
  (4, 'PAP-001', 'Cuaderno cuadriculado',  9500, 100, 'true'),
  (4, 'PAP-002', 'Set de marcadores',     24000,  50, 'true');

INSERT INTO pedidos (cliente_id, fecha_pedido, estado) VALUES
  (1, '2026-08-03 10:15:00', 'entregado'),
  (2, '2026-08-10 14:30:00', 'entregado'),
  (1, '2026-08-21 09:00:00', 'entregado'),
  (3, '2026-09-02 16:45:00', 'entregado'),
  (4, '2026-09-09 11:20:00', 'enviado'),
  (2, '2026-09-15 18:05:00', 'pagado'),
  (5, '2026-09-18 13:10:00', 'cancelado'),
  (1, '2026-09-25 08:40:00', 'enviado'),
  (6, '2026-09-28 12:00:00', 'pendiente'),
  (3, '2026-10-01 15:30:00', 'pagado'),
  (7, '2026-07-15 10:00:00', 'entregado'),
  (5, '2026-10-03 17:25:00', 'pendiente');

INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES
  (1, 1, 2, 42000),
  (1, 9, 3,  9500),
  (2, 3, 1, 85000),
  (2, 5, 1, 38000),
  (3, 6, 1, 55000),
  (3, 7, 2, 18000),
  (4, 2, 1, 120000),
  (4, 1, 2, 45000),
  (5, 10, 2, 24000),
  (5, 9, 4,  9500),
  (6, 3, 2, 89000),
  (6, 4, 1, 65000),
  (7, 5, 1, 38000),
  (7, 3, 1, 89000),
  (8, 6, 2, 55000),
  (8, 7, 3, 18000),
  (8, 10, 1, 24000),
  (9, 2, 1, 120000),
  (10, 3, 1, 89000),
  (10, 5, 2, 38000),
  (10, 9, 5,  9500),
  (11, 8, 2, 42000),
  (11, 1, 1, 42000),
  (12, 4, 1, 65000),
  (12, 10, 3, 24000);
-- Consultas basicas sobre clientes y pedidos
-- La 12 y el extra de la 11 cambian segun el motor: usa solo la de tu motor.

-- 1. Clientes de Medellin (WHERE + ORDER BY)
SELECT nombre, email
FROM clientes
WHERE ciudad = 'Medellín'
ORDER BY nombre;

-- 2. Productos con stock bajo (menos de 20), del mas escaso al menos escaso
SELECT nombre, stock
FROM productos
WHERE stock < 20
ORDER BY stock, nombre;

-- 3. Pedidos de septiembre de 2026 que no fueron cancelados (WHERE con AND)
SELECT id, cliente_id, fecha_pedido, estado
FROM pedidos
WHERE fecha_pedido >= '2026-09-01'
  AND fecha_pedido <  '2026-10-01'
  AND estado <> 'cancelado'
ORDER BY fecha_pedido;

-- 4. Cuantos pedidos hay por estado (GROUP BY + COUNT)
SELECT estado, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY estado
ORDER BY total_pedidos DESC, estado;

-- 5. Precio promedio por categoria (INNER JOIN + AVG)
SELECT c.nombre AS categoria, ROUND(AVG(p.precio), 0) AS precio_promedio
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
GROUP BY c.nombre
ORDER BY precio_promedio DESC;

-- 6. Categorias con mas de 2 productos (HAVING)
SELECT c.nombre AS categoria, COUNT(*) AS num_productos
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
GROUP BY c.nombre
HAVING COUNT(*) > 2
ORDER BY c.nombre;

-- 7. Clientes que nunca han hecho un pedido (LEFT JOIN + IS NULL)
SELECT c.nombre, c.email
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;

-- 8. Categorias que no tienen productos (LEFT JOIN + IS NULL)
SELECT c.nombre
FROM categorias c
LEFT JOIN productos p ON p.categoria_id = c.id
WHERE p.id IS NULL;

-- 9. Cuanto ha gastado cada cliente, sin contar pedidos cancelados (JOIN con la vista)
SELECT c.nombre, SUM(t.total) AS total_gastado
FROM clientes c
JOIN v_pedido_totales t ON t.cliente_id = c.id
WHERE t.estado <> 'cancelado'
GROUP BY c.nombre
ORDER BY total_gastado DESC;

-- 10. Clientes que han gastado mas de 300000 (HAVING con SUM)
SELECT c.nombre, SUM(t.total) AS total_gastado
FROM clientes c
JOIN v_pedido_totales t ON t.cliente_id = c.id
WHERE t.estado <> 'cancelado'
GROUP BY c.nombre
HAVING SUM(t.total) > 300000
ORDER BY total_gastado DESC;

-- 11. Unidades vendidas por producto, sin pedidos cancelados (JOIN de 3 tablas)
SELECT pr.nombre, SUM(d.cantidad) AS unidades
FROM detalle_pedido d
JOIN productos pr ON pr.id = d.producto_id
JOIN pedidos pe   ON pe.id = d.pedido_id
WHERE pe.estado <> 'cancelado'
GROUP BY pr.nombre
ORDER BY unidades DESC, pr.nombre;
-- Extra: solo los 3 mas vendidos. 
--   PostgreSQL:  LIMIT 3
--   SQL Server:  en vez de SELECT / SELECT TOP 3

-- 12. Ventas por mes, sin pedidos cancelados (cambia segun el motor)
-- PostgreSQL:
SELECT EXTRACT(MONTH FROM pe.fecha_pedido) AS mes, SUM(t.total) AS ventas
FROM pedidos pe
JOIN v_pedido_totales t ON t.pedido_id = pe.id
WHERE pe.estado <> 'cancelado'
GROUP BY EXTRACT(MONTH FROM pe.fecha_pedido)
ORDER BY mes;

-- SQL Server (borra el de PostgreSQL):
-- SELECT MONTH(pe.fecha_pedido) AS mes, SUM(t.total) AS ventas
-- FROM pedidos pe
-- JOIN v_pedido_totales t ON t.pedido_id = pe.id
-- WHERE pe.estado <> 'cancelado'
-- GROUP BY MONTH(pe.fecha_pedido)
-- ORDER BY mes;
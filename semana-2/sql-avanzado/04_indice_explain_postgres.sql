-- Reto día 6 · EXPLAIN ANALYZE antes y después de crear un índice (PostgreSQL)
-- Con 12 pedidos cualquier consulta es instantánea, así que la prueba se hace sobre una tabla
-- aparte con 500.000 pedidos generados. No toca las tablas reales de la tienda.
-- Resultados y conclusiones: 04_indice_explain.md

DROP TABLE IF EXISTS pedidos_prueba;

CREATE TABLE pedidos_prueba (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id   INT NOT NULL,
    fecha_pedido TIMESTAMP NOT NULL,
    estado       VARCHAR(15) NOT NULL,
    total        DECIMAL(12,2) NOT NULL
);

-- 500.000 pedidos de 5.000 clientes, repartidos en el último año
INSERT INTO pedidos_prueba (cliente_id, fecha_pedido, estado, total)
SELECT (random() * 4999)::INT + 1,
       now() - (random() * INTERVAL '365 days'),
       (ARRAY['pendiente','pagado','enviado','entregado','cancelado'])[(random() * 4)::INT + 1],
       round((random() * 500000)::NUMERIC, 2)
FROM generate_series(1, 500000);

ANALYZE pedidos_prueba;   -- actualiza las estadísticas que usa el planificador

-- La consulta a medir: los pedidos de un cliente en los últimos 90 días
-- ----------------------------- ANTES -----------------------------
EXPLAIN ANALYZE
SELECT id, fecha_pedido, estado, total
FROM pedidos_prueba
WHERE cliente_id = 1234
  AND fecha_pedido >= now() - INTERVAL '90 days'
ORDER BY fecha_pedido DESC;

-- Índice compuesto: primero la columna del filtro de igualdad, después la del rango y el orden
CREATE INDEX idx_pedidos_prueba_cliente_fecha ON pedidos_prueba (cliente_id, fecha_pedido);
ANALYZE pedidos_prueba;

-- ----------------------------- DESPUÉS -----------------------------
EXPLAIN ANALYZE
SELECT id, fecha_pedido, estado, total
FROM pedidos_prueba
WHERE cliente_id = 1234
  AND fecha_pedido >= now() - INTERVAL '90 days'
ORDER BY fecha_pedido DESC;

-- El costo del índice: tamaño en disco y escrituras más lentas
SELECT pg_size_pretty(pg_relation_size('pedidos_prueba'))                   AS tamano_tabla,
       pg_size_pretty(pg_relation_size('idx_pedidos_prueba_cliente_fecha')) AS tamano_indice;

-- Limpieza: descomenta para borrar la tabla de prueba
-- DROP TABLE pedidos_prueba;


CREATE OR REPLACE VIEW v_ventas_mensuales AS
SELECT
    EXTRACT(YEAR  FROM p.fecha_pedido)::int AS año,
    EXTRACT(MONTH FROM p.fecha_pedido)::int AS mes,
    COUNT(*)                                AS num_pedidos,
    SUM(t.total)                            AS total_ventas
FROM pedidos p
JOIN v_pedido_totales t ON t.pedido_id = p.id
WHERE p.estado <> 'cancelado'
GROUP BY 1, 2
ORDER BY año, mes;

SELECT * FROM v_ventas_mensuales;



CREATE MATERIALIZED VIEW mv_ventas_mensuales AS

SELECT * FROM v_ventas_mensuales;

SELECT * FROM mv_ventas_mensuales;
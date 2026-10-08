USE tienda;

CREATE OR ALTER VIEW v_ventas_mensuales AS
SELECT
    YEAR(p.fecha_pedido)  AS anio,
    MONTH(p.fecha_pedido) AS mes,
    COUNT(*)              AS num_pedidos,
    SUM(t.total)          AS total_ventas
FROM pedidos p
JOIN v_pedido_totales t ON t.pedido_id = p.id
WHERE p.estado <> 'cancelado'
GROUP BY YEAR(p.fecha_pedido), MONTH(p.fecha_pedido);



SELECT * FROM v_ventas_mensuales ORDER BY anio, mes;
-- Reto día 6 · Ranking de clientes por mes con funciones de ventana (PostgreSQL)
-- Para cada mes: cuánto compró cada cliente, su puesto dentro del mes,
-- qué porcentaje del mes representa y cuánto compró el mes anterior.

WITH ventas_cliente_mes AS (          -- CTE: compras por cliente y mes (sin cancelados)
    SELECT date_trunc('month', p.fecha_pedido)::date AS mes,
           c.id                                    AS cliente_id,
           c.nombre                                AS cliente,
           COUNT(*)                                AS pedidos,
           SUM(t.total)                            AS total
    FROM pedidos p
    JOIN v_pedido_totales t ON t.pedido_id = p.id
    JOIN clientes c         ON c.id = p.cliente_id
    WHERE p.estado <> 'cancelado'
    GROUP BY 1, 2, 3
)
SELECT to_char(mes, 'YYYY-MM')                                        AS mes,
       cliente,
       pedidos,
       total,
       RANK()       OVER (PARTITION BY mes ORDER BY total DESC)       AS puesto,
       DENSE_RANK() OVER (PARTITION BY mes ORDER BY total DESC)       AS puesto_denso,
       ROW_NUMBER() OVER (PARTITION BY mes ORDER BY total DESC, cliente) AS fila,
       ROUND(100 * total / SUM(total) OVER (PARTITION BY mes), 1)     AS pct_del_mes,
       LAG(total)   OVER (PARTITION BY cliente_id ORDER BY mes)       AS total_mes_anterior
FROM ventas_cliente_mes
ORDER BY mes, puesto, cliente;

-- Solo el mejor cliente de cada mes (el puesto 1)
WITH ventas_cliente_mes AS (
    SELECT date_trunc('month', p.fecha_pedido)::date AS mes, c.nombre AS cliente, SUM(t.total) AS total
    FROM pedidos p
    JOIN v_pedido_totales t ON t.pedido_id = p.id
    JOIN clientes c         ON c.id = p.cliente_id
    WHERE p.estado <> 'cancelado'
    GROUP BY 1, 2
), ranking AS (
    SELECT mes, cliente, total, RANK() OVER (PARTITION BY mes ORDER BY total DESC) AS puesto
    FROM ventas_cliente_mes
)
SELECT to_char(mes, 'YYYY-MM') AS mes, cliente, total
FROM ranking
WHERE puesto = 1
ORDER BY mes;

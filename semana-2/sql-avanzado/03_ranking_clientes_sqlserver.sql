-- Reto día 6 · Ranking de clientes por mes con funciones de ventana (SQL Server)
-- Mismo resultado que la versión de PostgreSQL; cambian las funciones de fecha y de redondeo.

USE tienda;
GO

WITH ventas_cliente_mes AS (          -- CTE: compras por cliente y mes (sin cancelados)
    SELECT DATEFROMPARTS(YEAR(p.fecha_pedido), MONTH(p.fecha_pedido), 1) AS mes,
           c.id     AS cliente_id,
           c.nombre AS cliente,
           COUNT(*) AS pedidos,
           SUM(t.total) AS total
    FROM pedidos p
    JOIN v_pedido_totales t ON t.pedido_id = p.id
    JOIN clientes c         ON c.id = p.cliente_id
    WHERE p.estado <> 'cancelado'
    GROUP BY DATEFROMPARTS(YEAR(p.fecha_pedido), MONTH(p.fecha_pedido), 1), c.id, c.nombre
)
SELECT FORMAT(mes, 'yyyy-MM')                                            AS mes,
       cliente,
       pedidos,
       total,
       RANK()       OVER (PARTITION BY mes ORDER BY total DESC)          AS puesto,
       DENSE_RANK() OVER (PARTITION BY mes ORDER BY total DESC)          AS puesto_denso,
       ROW_NUMBER() OVER (PARTITION BY mes ORDER BY total DESC, cliente) AS fila,
       CAST(100.0 * total / SUM(total) OVER (PARTITION BY mes) AS DECIMAL(5,1)) AS pct_del_mes,
       LAG(total)   OVER (PARTITION BY cliente_id ORDER BY mes)          AS total_mes_anterior
FROM ventas_cliente_mes
ORDER BY ventas_cliente_mes.mes, puesto, cliente;
GO

-- Solo el mejor cliente de cada mes (el puesto 1)
WITH ventas_cliente_mes AS (
    SELECT DATEFROMPARTS(YEAR(p.fecha_pedido), MONTH(p.fecha_pedido), 1) AS mes,
           c.nombre AS cliente, SUM(t.total) AS total
    FROM pedidos p
    JOIN v_pedido_totales t ON t.pedido_id = p.id
    JOIN clientes c         ON c.id = p.cliente_id
    WHERE p.estado <> 'cancelado'
    GROUP BY DATEFROMPARTS(YEAR(p.fecha_pedido), MONTH(p.fecha_pedido), 1), c.nombre
), ranking AS (
    SELECT mes, cliente, total, RANK() OVER (PARTITION BY mes ORDER BY total DESC) AS puesto
    FROM ventas_cliente_mes
)
SELECT FORMAT(mes, 'yyyy-MM') AS mes, cliente, total
FROM ranking
WHERE puesto = 1
ORDER BY ranking.mes;
GO

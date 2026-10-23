# Índice: EXPLAIN ANALYZE antes y después

Script: `04_indice_explain_postgres.sql`. Corre sobre una tabla aparte, `pedidos_prueba`, con **500.000 pedidos** de 5.000 clientes generados al azar, para no tocar los datos de la tienda (con 12 pedidos cualquier consulta tarda menos de 1 ms y no se nota nada).

## La consulta medida

Los pedidos de un cliente en los últimos 90 días, del más reciente al más viejo:

```sql
SELECT id, fecha_pedido, estado, total
FROM pedidos_prueba
WHERE cliente_id = 1234
  AND fecha_pedido >= now() - INTERVAL '90 days'
ORDER BY fecha_pedido DESC;
```

## Índice creado

```sql
CREATE INDEX idx_pedidos_prueba_cliente_fecha ON pedidos_prueba (cliente_id, fecha_pedido);
```

Primero va la columna que se filtra por igualdad (`cliente_id`) y después la del rango (`fecha_pedido`). Al revés, el índice serviría mucho menos.

## Resultados

| | Antes (sin índice) | Después (con índice) |
|---|---|---|
| Cómo busca | `Parallel Seq Scan`: lee la tabla completa con 2 procesos | `Bitmap Index Scan`: va directo a las filas del cliente |
| Filas descartadas | ~500.000 (`Rows Removed by Filter: 166656` × 3 procesos) | 0 |
| Filas devueltas | 32 | 32 |
| Tiempo de ejecución | **38,3 ms** | **0,17 ms** |

La consulta pasó a ser unas **200 veces más rápida**. Los números exactos cambian en cada corrida porque los datos son aleatorios, pero la diferencia siempre es de ese orden.

## El costo del índice

| | Tamaño |
|---|---|
| Tabla `pedidos_prueba` | 32 MB |
| Índice | 15 MB |

El índice ocupa casi la mitad de la tabla, y cada `INSERT`, `UPDATE` o `DELETE` tiene que actualizarlo también.

## Conclusiones

- **Ayuda** cuando la consulta filtra u ordena por columnas muy selectivas (pocos resultados de muchas filas), como "los pedidos de un cliente".
- **No ayuda o perjudica** en tablas pequeñas (leer todo es igual de rápido), en columnas con pocos valores distintos (como `estado`, con 5 valores) y en tablas con muchísimas escrituras, porque cada índice las hace más lentas.
- **No se crean índices "por si acaso"**: primero se mide con `EXPLAIN ANALYZE`, se crea el índice y se vuelve a medir.

## En SQL Server

El equivalente es el **plan de ejecución real** (en SSMS, `Ctrl+M` antes de ejecutar) junto con:

```sql
SET STATISTICS IO, TIME ON;
```

Ahí se compara `Table Scan` / `Clustered Index Scan` (lee todo) contra `Index Seek` (va directo), y las *logical reads* antes y después del índice.

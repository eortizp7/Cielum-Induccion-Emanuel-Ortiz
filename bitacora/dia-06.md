# Bitácora Día 06 · [SQL avanzado (PostgreSQL + SQL Server)]
**Fecha: 6 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 3 h · reto 2 h

## Autoinvestigación básica

1. Pregunta: Subconsultas y `EXISTS`.
   Respuesta: Una subconsulta es un `SELECT` dentro de otro, que se usa como filtro, como columna o como tabla. `EXISTS` pregunta si la subconsulta devuelve al menos una fila: en cuanto encuentra una, para, por eso es más eficiente que contar. `NOT EXISTS` sirve para "los que no tienen".
   Ejemplo propio: clientes que nunca han hecho un pedido.
   ```sql
   SELECT c.nombre FROM clientes c
   WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);
   ```
   Fuente: PostgreSQL 16 docs, "Subquery Expressions"

2. Pregunta: Vistas: ¿para qué sirven?
   Respuesta: Una vista es una consulta guardada con nombre, que se usa como si fuera una tabla. Sirve para no repetir consultas largas, para esconder la complejidad (los JOIN) y para dar acceso solo a ciertas columnas. No guarda datos: se calcula cada vez que se consulta.
   Ejemplo propio: `v_pedido_totales` calcula el total de cada pedido sumando su detalle, en vez de guardar el total en la tabla `pedidos`. La usan la API y las demás vistas.
   Fuente: PostgreSQL 16 docs, tutorial "Views"

3. Pregunta: `CASE WHEN`, `COALESCE`, manejo de `NULL`.
   Respuesta: `CASE WHEN` es un "si / si no" dentro de la consulta. `COALESCE` devuelve el primer valor que no sea `NULL`, y sirve para poner un valor por defecto. `NULL` significa "no se sabe", por eso `NULL = NULL` no es verdadero: se compara con `IS NULL` / `IS NOT NULL`, y las funciones como `SUM` ignoran los `NULL`.
   Ejemplo propio: `COALESCE(t.total, 0)` en la API, para que un pedido sin detalle muestre 0 y no vacío. Y para clasificar pedidos:
   ```sql
   SELECT id, CASE WHEN estado IN ('pagado','enviado','entregado') THEN 'cobrado' ELSE 'por cobrar' END AS cobro
   FROM pedidos;
   ```
   Fuente: PostgreSQL 16 docs, "Conditional Expressions"

4. Pregunta: Diferencias de sintaxis entre PostgreSQL y SQL Server.

   | Para | PostgreSQL | SQL Server |
   |---|---|---|
   | Limitar filas | `LIMIT 10 OFFSET 20` | `TOP 10` o `ORDER BY ... OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY` |
   | Autoincremental | `GENERATED ALWAYS AS IDENTITY` (o `SERIAL`) | `IDENTITY(1,1)` |
   | Buscar sin importar mayúsculas | `ILIKE` | `LIKE` (depende de la *collation*; la normal no distingue mayúsculas) |
   | Concatenar | `'a' \|\| 'b'` o `CONCAT()` | `'a' + 'b'` o `CONCAT()` |
   | Fecha y hora actual | `NOW()` | `GETDATE()` / `SYSDATETIME()` |
   | Extraer mes | `EXTRACT(MONTH FROM fecha)` | `MONTH(fecha)` |

   Ejemplo propio: la vista `v_ventas_mensuales` está en los dos motores y cambia `EXTRACT` por `YEAR()` / `MONTH()`.
   Fuente: learn.microsoft.com/sql/t-sql · PostgreSQL 16 docs

## Autoinvestigación avanzada

1. CTE y CTE recursivas.
   Una CTE (`WITH nombre AS (...)`) es una consulta temporal con nombre que solo vive dentro de la consulta. Sirve para partir una consulta larga en pasos que se leen de arriba abajo. Una CTE recursiva (`WITH RECURSIVE`) se llama a sí misma y sirve para jerarquías (categorías dentro de categorías, organigramas) o para generar series.
   Ejemplo propio: el ranking de clientes (`03_ranking_clientes_postgres.sql`) primero calcula las ventas por cliente y mes en una CTE, y luego las ordena.

2. Funciones de ventana.
   Calculan algo sobre un grupo de filas **sin juntarlas**, a diferencia de `GROUP BY`. `PARTITION BY` dice el grupo y `ORDER BY` el orden dentro de él.
   - `ROW_NUMBER()`: numera 1, 2, 3 aunque haya empates.
   - `RANK()`: con empates repite el puesto y salta (1, 1, 3).
   - `DENSE_RANK()`: repite pero no salta (1, 1, 2).
   - `LAG()` / `LEAD()`: el valor de la fila anterior / siguiente.
   - `SUM() OVER (PARTITION BY ... ORDER BY ...)`: totales o acumulados por grupo.
   Ejemplo propio: puesto de cada cliente dentro del mes, porcentaje del mes y lo que compró el mes anterior.

3. Índices.
   Un índice es como el índice de un libro: permite llegar a las filas sin leer toda la tabla. Ayuda en columnas que se usan mucho en `WHERE`, `JOIN` y `ORDER BY` y que son selectivas. Perjudica en tablas pequeñas, en columnas con pocos valores distintos y en tablas con muchas escrituras, porque cada `INSERT` / `UPDATE` también actualiza el índice y ocupa espacio. Se mide con `EXPLAIN ANALYZE` en PostgreSQL y con el plan de ejecución real en SQL Server.
   Ejemplo propio: en 500.000 pedidos, buscar los de un cliente pasó de 38 ms a 0,17 ms con el índice (`04_indice_explain.md`).

4. Transacciones, ACID y niveles de aislamiento.
   Una transacción agrupa varias operaciones para que pasen todas o ninguna: `BEGIN` empieza, `COMMIT` confirma y `ROLLBACK` deshace. ACID:
   - **Atomicidad**: todo o nada.
   - **Consistencia**: se respetan las reglas (llaves, `CHECK`).
   - **Aislamiento**: una transacción no ve los cambios a medias de otra.
   - **Durabilidad**: lo confirmado no se pierde.

   Los niveles de aislamiento (`READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`) deciden cuánto se protege una transacción de las demás; más aislamiento es más seguro pero más lento. PostgreSQL y SQL Server usan `READ COMMITTED` por defecto.
   Ejemplo propio: crear un pedido descuenta stock de varios productos. Si uno no alcanza, se hace `ROLLBACK` y no queda ni el pedido ni los descuentos.

5. Funciones y procedimientos almacenados.
   Son código guardado dentro de la base de datos. Una **función** devuelve un valor y se usa dentro de un `SELECT`. Un **procedimiento** se ejecuta con `CALL` (PostgreSQL) o `EXEC` (SQL Server) y puede manejar transacciones. PostgreSQL usa PL/pgSQL y SQL Server usa T-SQL.
   Ejemplo propio: `registrar_pedido`, en los dos lenguajes.

6. Vistas materializadas y triggers.
   Una **vista materializada** guarda el resultado de la consulta como si fuera una tabla. Es rápida de leer, pero queda desactualizada hasta hacer `REFRESH MATERIALIZED VIEW`. Sirve para reportes pesados que no necesitan datos al segundo. Un **trigger** es código que la base ejecuta sola cuando pasa algo en una tabla (antes o después de un `INSERT`, `UPDATE` o `DELETE`), por ejemplo para guardar un historial de cambios.
   Ejemplo propio: `mv_ventas_mensuales`, la vista materializada de las ventas por mes.

7. Seguridad: roles, mínimo privilegio, inyección SQL.
   Cada aplicación o persona debe tener un rol con **solo los permisos que necesita** (mínimo privilegio): por ejemplo, un usuario de reportes con solo `SELECT`. La **inyección SQL** pasa cuando se pega texto del usuario dentro de la consulta y ese texto cambia el SQL. Se evita con **consultas parametrizadas**, donde los valores viajan aparte.
   Ejemplo propio: la API nunca arma el SQL con texto del usuario; usa `$1, $2` con `pg` (`proyecto/api/rutas/pedidos.js`), y n8n hace lo mismo en el `INSERT` del log.

## Ejercicios

Las 12 consultas avanzadas, en los dos motores: (PENDIENTE: completar con la lista de `03_Ejercicios_por_Tema.md`).

## Reto del día

Todo está en `semana-2/sql-avanzado/`.

**1. Procedimiento `registrar_pedido`** (`02_registrar_pedido_postgres.sql` y `02_registrar_pedido_sqlserver.sql`). Recibe el cliente, la lista de productos en JSON y una nota. Inserta el pedido y su detalle y descuenta el inventario dentro de una transacción. Si un producto no tiene stock, se deshace todo:
- En PostgreSQL, el `RAISE EXCEPTION` aborta la transacción y deshace el pedido y los descuentos que ya se habían hecho.
- En SQL Server, `BEGIN TRANSACTION` + `TRY/CATCH`: el `CATCH` hace `ROLLBACK` y relanza el error.

Probado en PostgreSQL: un pedido con el producto 4 (stock 0) da *"Stock insuficiente para el producto 4"*, y el stock del producto 1, que venía antes en el mismo pedido, queda igual.

**2. Vista `v_ventas_mensuales` y vista materializada `mv_ventas_mensuales`** (`01_vistas_postgres.sql` y `01_vistas_sqlserver.sql`). Pedidos y ventas por año y mes, sin cancelados. Estas vistas también se cargan en el `docker-compose.yml` del proyecto.

**3. Ranking de clientes por mes** (`03_ranking_clientes_postgres.sql` y `03_ranking_clientes_sqlserver.sql`). Usa una CTE y las funciones de ventana `RANK`, `DENSE_RANK`, `ROW_NUMBER`, `SUM() OVER` y `LAG`.

**4. `EXPLAIN ANALYZE` antes y después de un índice** (`04_indice_explain_postgres.sql` y `04_indice_explain.md`). Con 500.000 pedidos de prueba, la consulta pasó de leer toda la tabla (*Parallel Seq Scan*, 38 ms) a usar el índice (*Bitmap Index Scan*, 0,17 ms).

## Lo que aprendí hoy

## Lo que no entendí o me costó

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy
Sí, la usé para resolver dudas de la investigación y para armar los procedimientos, el ranking y la prueba del índice.

## Autoevaluación del tema (1-5): 4

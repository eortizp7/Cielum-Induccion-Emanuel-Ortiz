# Bitácora Día 05 · [SQL fundamentos (PostgreSQL + SQL Server)]
**Fecha: 6 de Octubre**
**Horas invertidas:** autoinvestigación 2 h · práctica  2 h · reto  h

## Autoinvestigación básica
1. Pregunta: ¿Qué es una base de datos relacional, tabla, llave primaria y llave foránea?
   Respuesta: Una base de datos relacional es aquella que guarda la información en tablas y conecta las tablas mediante llaves, para así permitir que la información se relacione y no tener que repetir datos. La llave primaria es la que idenfitica el dato de forma única y la foranea es la que conecta el dato hacia otra tabla. 
   Ejemplo: Una base de datos con tablas: cliente y pedido, no es necesario escribir el nombre del cliente para cada pedido, con la llave id_cliente, relacionamos con cada pedido existente para el cliente. Como id_cliente es la llave primaria, al ser obligatoria nos aseguramos que no hayan pedidos sin clientes.  
   Fuente: PostgreSQL 16, 3.3 Foreign Keys

2. Pregunta: DDL vs DML: CREATE, ALTER, DROP vs INSERT, UPDATE, DELETE, SELECT.
   Respusta: Todo comando de SQL cumple con una de las dos funciones. Cambiar la estructura de la base de datos  o cambiar los datos que hay dentro. 
    
    DDL: Data Definition Lenguaje, cambia la estructura de la base de datos. Crea, modifica o borra las tablas. 
    DML: Data Manipulation Lenguaje, cambia los datos, inserta, borra o edita filas. 

   DDL 
   -CREATE : Crea algo nuevo, como una tabla por ejemplo. 
   -ALTER : Modifica la estructura, agregar o quitar columnas. 
   -DROP : Borra la tabla completa con sus datos. 
   
   DML
   -INSERT : Agrega filas. 
   -UPDATE : Cambia datos de filas que ya existen. 
   -DELETE : Borra filas. 
   -SELECT : Consulta y muestra datos sin modificarlos. 

   Fuente: The SQL Language

3. Pregunta : WHERE, ORDER BY, GROUP BY, HAVING, funciones de agregación.
   Respuesta : Las consultas se arman como cadenas de pasos, para que funcionen mejor tenemos las siguientes clausuras:
      -WHERE: Decide que filas entran, antes de agrupar. 
      -GROUP BY : Junta las filas que comparten un valor en grupos. Por ejemplo cuando usamos funciones de agregación. 
      -HAVING : Decide que grupos se quedan despues de filtrar. 
      -ORDER BY : Ordena el resultado final. 

      Funciones de agregación: Es una función que toma muchas filas y devuelve un único valor. 
      -COUNT : Cuantas filas hay o cuantos valores hay. 
      -SUM : Suma.
      -AVG : Promedio.
      -MIN : Menor.
      -MAX : Mayor.

   Fuente: PostgreSQL 16, 2.7 Aggregate Functions

4. Pregunta : INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN.
   Respuesta : Los JOIN son los que juntas las tablas que estan conectadas con llaves, es la aplicación real de las llaves foreanes y primarias, permitiendo que mediante esa relación podamos acceder a los datos de esa tabla, sin haberlos tenido que repetir inecesariamente. 

      -INNER JOIN : Devuelven las filas que tienen pareja en las dos tablas. 
      -LEFT JOIN : Devuelve todas las tablas de la izquierda con o sin pareja. 
      -RIGT JOIN : Devuelve todas las tablas de la derecha con o sin pareja. 
      -FULL JOIN : Deuelve todas las de las dos tablas, con o sin pareja. 

   Fuente : PostgreSQL 16, 2.6 Joins Between Tables

5. Pregunta : Tipos de datos más usados en PostgreSQL y en SQL Server y sus equivalencias.

   ## Equivalencias de tipos de datos: PostgreSQL vs SQL Server

   | Para guardar | PostgreSQL | SQL Server |
   |---|---|---|
   | Entero pequeño | `smallint` | `smallint` (también `tinyint`, de 0 a 255) |
   | Entero normal | `integer` (alias `int`) | `int` |
   | Entero grande | `bigint` | `bigint` |
   | Autoincremental | `GENERATED ALWAYS AS IDENTITY` (o `serial`) | `IDENTITY(1,1)` |
   | Decimal exacto | `numeric(p,s)` / `decimal` | `decimal(p,s)` / `numeric` |
   | Decimal aproximado | `real`, `double precision` | `real`, `float` |
   | Dinero | `money` (mejor `numeric`) | `money`, `smallmoney` (mejor `decimal`) |
   | Texto corto | `varchar(n)` | `varchar(n)` |
   | Texto largo | `text` | `varchar(max)` |
   | Texto Unicode | `varchar` / `text` | `nvarchar(n)` |
   | Verdadero/falso | `boolean` | `bit` (0 o 1) |
   | Fecha | `date` | `date` |
   | Hora | `time` | `time` |
   | Fecha y hora | `timestamp` | `datetime2` |
   | Fecha y hora con zona | `timestamptz` | `datetimeoffset` |
   | Intervalo de tiempo | `interval` | no tiene |
   | Identificador único | `uuid` | `uniqueidentifier` |
   | Binario | `bytea` | `varbinary(max)` |
   | JSON | `json` / `jsonb` | `json` (solo versiones recientes) |

## Autoinvestigación avanzada

   N/A

## Ejercicio de hoy 

Creación y consultas de la base de datos en SQL sever y Postgress. Los querys se encuentran subidos en la carpeta sql, a continuación quiero plasmar el resumen de los resultados de las consultas. 

| # | Pregunta | Técnica | Filas | Resultado clave |
|---|----------|---------|-------|-----------------|
| 1 | Clientes de Medellín | WHERE + ORDER BY | 3 | Ana Gómez, Daniel Cano, Pedro Solano |
| 2 | Productos con stock menor a 20 | WHERE + ORDER BY | 4 | Cargador (0), Balón (12), Sábanas (15), Botella (18) |
| 3 | Pedidos de septiembre no cancelados | WHERE con AND y rango de fechas | 5 | Pedidos 4, 5, 6, 8, 9 |
| 4 | Pedidos por estado | GROUP BY + COUNT | 5 | entregado 5, enviado 2, pagado 2, pendiente 2, cancelado 1 |
| 5 | Precio promedio por categoría | INNER JOIN + AVG | 4 | Hogar 82.500, Tecnología 64.000, Deportes 38.333, Papelería 16.750 |
| 6 | Categorías con más de 2 productos | HAVING | 2 | Deportes (3), Tecnología (3) |
| 7 | Clientes que nunca pidieron | LEFT JOIN + IS NULL | 1 | Daniel Cano |
| 8 | Categorías sin productos | LEFT JOIN + IS NULL | 1 | Mascotas |
| 9 | Gasto por cliente (sin cancelados) | JOIN con la vista + SUM | 7 | Marta Ríos 422.500 de primera |
| 10 | Clientes con gasto mayor a 300.000 | HAVING + SUM | 3 | Marta, Ana, Luis |
| 11 | Unidades vendidas por producto | JOIN de 3 tablas | 10 | Cuaderno cuadriculado, 12 |
| 12 | Ventas por mes | Función de fecha (cambia por motor) | 4 | Jul 126.000, Ago 326.500, Sep 847.000, Oct 349.500 |

## Lo que aprendí hoy 

   Hoy tuve mi primer contacto con Docker y el tema de DBeaver para el manejo de Postgres y Sql. Adicionalmente, reconocer las similitudes entre Sql Server y PostGress, que son muy similares. 

## Lo que no entendí o me costó

   El manejo de Docker y los comandos para conectarlo con el DBeaver. 

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy

-Si, usé la IA para hacer las conexiónes con el DBeaver para las dos bases de datos y para hacer la sintaxis de Postgress. 

## Autoevaluación del tema (1-5): 4 

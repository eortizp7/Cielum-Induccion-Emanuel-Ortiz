# Bitácora Día 07 · [Node.js + Express: API REST]
**Fecha: 8 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 3 h · reto 2 h

## Autoinvestigación básica
1. Pregunta: ¿Qué es Node.js y en qué se diferencia de JS en el navegador?
Respuesta: Node.js es un programa que ejecuta JS fuera del navegador, sirve para hacer backend o servidores con  APIs que reciban peticiones. El navegador tiene window y document, y sirve para manipular la página. Node tiene process, fs y http, y sirve para archivos, servidores y variables de entorno.
Fuente: Introduction to Node.js, nodejs.org

2. Pregunta: npm, package.json, dependencias vs devDependencies, package-lock.json, scripts.
Respuesta: npm es el instalador de los paquetes, package.json es la ficha del proyecto con nombre, scripts y dependencias. Las dependencies son para correr la app y devDependencies son solo para desarrollar. Los scripts son atajos que se ejecutan con npm run nombre. Y package-lock.json es el que fija las versiones exactas para que todos tengan lo mismo, y se sube a Git.
Fuente: Scripts, npm Docs. 

3. Pregunta: ¿Qué es REST? Métodos HTTP, códigos de estado (200, 201, 204, 400, 401, 403, 404, 409, 500).
Respuesta: Rest es como un estandar o metodo para definir las API, donde cada recurso tiene su ruta y el metodo HTTP es el que nos indica la acción. Y los códigos nos sirven para idenfiticar las respuestas de las acciones. 2xx, salió bien: 200 (ok), 201 (se creó algo), 204 (ok y no hay nada que devolver). 4xx, error del cliente (tú mandaste algo mal): 400 (datos inválidos), 401 (no autenticado), 403 (sin permiso), 404 (no existe), 409 (choca con lo que ya hay, como un email repetido).
5xx, error del servidor (falló mi código): 500.
Fuente: HTTP response status codes. HTTP request methods. 

4. Pregunta: ¿Qué es Express, qué es una ruta y qué es un middleware?
Respuesta: Express es un framework de node que facilita creae APIs, las rutas son las que dicen como responder al metodo y el middelware es la función intermedia que revisa la petición y la deja pasar. 
Fuente: expressjs.com | Routing

5. Pregunta: Variables de entorno con .env.
Respuesta: Las variables de entorno son datos de configuarcion que se guardan fuera del codigo en un archivo .env para no exponer secretos como contraseñas. El .env no se sube a git, se sube un .env de ejemplo sin valores reales, solo para que el otro sepa que valores llenar. 
Fuente: Node.js, How to read environment variables.

## Autoinvestigación avanzada
1. Arquitectura por capas: rutas → controladores → servicios → repositorios.

Basicamente es dividir el codigo en capas, dandole a cada una, una responsabilidad única. La ruta se encarga de conectar la URL con el controlador, no hay nada de logica. El controlador habla con la wen y tiene los req y res. El servicio son las reglas de negocio, donde esta la logica. Y el repositorio es el que se conecta con la base de datos y sabe de SQL. 

2. Validación de entrada (zod o joi).

Validamos la entrada para verificar que los datos lleguen correctamente como los necesitamos. Con zod definimos un es esquema de como deberian ser los datos y con parse los verificamos. Asi la API sabe si puede responder un 400 con los errores en vez de un 500 diciendo que el servidor falló. 

Ejemplo propio: en `semana-2/api-ejercicios/03_avanzado_pg_zod.js` el esquema dice que `precio` es un número mayor o igual a 0 y que `sku` es obligatorio. Si llega `{"nombre":"","precio":-5}`, la API responde 400 con la lista de campos que fallaron.

3. Manejo centralizado de errores.

En vez de poner `try/catch` y `res.status(500)` en cada ruta, todos los errores llegan a un solo middleware al final, que tiene 4 parámetros `(err, req, res, next)`. Ahí se decide qué código responder: 400 si los datos están mal, 404 si no existe, 409 si choca con algo que ya existe y 500 para lo inesperado. El detalle técnico se escribe en el log del servidor y al cliente nunca se le muestra. En Express 5, si una ruta `async` lanza un error, llega sola a ese middleware.
Ejemplo propio: `proyecto/api/index.js`, líneas 37-44, y el middleware del ejercicio avanzado, que traduce los códigos de PostgreSQL (`23505` a 409 por SKU repetido, `23503` a 400 por categoría inexistente).

4. Conexión a PostgreSQL con `pg` (pool, consultas parametrizadas).

Un `Pool` mantiene varias conexiones abiertas y las reutiliza, en vez de abrir y cerrar una conexión por cada consulta, que es lento. Las consultas parametrizadas mandan el SQL con `$1, $2` y los valores aparte. Así el texto del usuario nunca se mezcla con el SQL y no hay inyección SQL. Para una transacción se toma una sola conexión con `pool.connect()`, se hace `BEGIN`/`COMMIT`/`ROLLBACK` y se devuelve con `release()`.
Ejemplo propio: `proyecto/api/db.js` crea el pool, y `proyecto/api/rutas/pedidos.js` usa `pool.connect()` para crear el pedido en una transacción.

5. Autenticación con JWT.

Un JWT es un texto con tres partes: cabecera, datos y firma. La API lo **firma** con un secreto (`jwt.sign`) al hacer login, y en cada petición lo **verifica** (`jwt.verify`): si alguien cambia los datos, la firma ya no coincide. Los datos no están cifrados, cualquiera los puede leer, por eso nunca se mete una clave adentro. Dónde NO guardarlo: en el código, en la URL, ni en un repositorio. En el navegador, `localStorage` es cómodo pero un script malicioso (XSS) lo podría leer; lo más seguro es una cookie `httpOnly`.
Ejemplo propio: `proyecto/api/autenticacion.js` firma con `JWT_SECRET` (HS256, vence en 1 hora) y verifica en `requiereToken`.

6. Buenas prácticas: CORS, helmet, logs, paginación.

- **CORS**: decir qué orígenes (páginas web) pueden llamar a la API desde el navegador. Solo los necesarios, nunca `*` con datos privados.
- **helmet**: middleware que agrega cabeceras de seguridad a las respuestas (por ejemplo, para evitar que la página se cargue dentro de otra o que el navegador adivine tipos de archivo).
- **Logs**: registrar errores y eventos importantes en el servidor, sin datos sensibles como claves o tokens.
- **Paginación**: no devolver miles de filas de una vez; se piden por páginas con `LIMIT` y `OFFSET`, y se devuelve el total para saber cuántas páginas hay.

Ejemplo propio: CORS con la lista `CORS_ORIGENES` (`proyecto/api/index.js`, líneas 19-23) y `GET /pedidos?estado=&pagina=&limite=` con un límite máximo de 100.

## Ejercicios

Los tres están en `semana-2/api-ejercicios/` (con `npm install` y `npm run basico`, `npm run intermedio` o `npm run avanzado`).

**Básico** (`01_basico_salud.js`, puerto 4000): servidor Express con `GET /salud`, que responde `{ "estado": "ok", "fecha": "..." }`.

**Intermedio** (`02_intermedio_crud_memoria.js`, puerto 4001): CRUD de productos guardado en un arreglo. Listar, consultar, crear (201), actualizar y eliminar (204), con validación de nombre y precio. Al reiniciar se pierden los cambios, porque no hay base de datos.

**Avanzado** (`03_avanzado_pg_zod.js`, puerto 4002): el mismo CRUD sobre la tabla `productos` de PostgreSQL con `pg` (pool y consultas parametrizadas), validación con **zod** y **middleware de errores** centralizado. Probado: crear (201), SKU repetido (409), datos inválidos (400 con el detalle por campo), JSON mal escrito (400), id que no es número (400), producto inexistente (404), categoría inexistente (400) y borrado lógico (204).

## Reto del día

Proyecto integrador, parte 1, en `proyecto/api/`:
- CRUD de `clientes`, `productos` y `pedidos`. Crear un pedido inserta el detalle y descuenta el stock en una **transacción**: si un producto no alcanza, se hace rollback y responde 409.
- `GET /pedidos?estado=&pagina=&limite=` con filtro y paginación.
- Login con JWT (`POST /auth/login`) y rutas protegidas con el middleware `requiereToken`.
- `.env.example` y `README.md` con cómo correrla y la lista de endpoints.

## Lo que aprendí hoy
Mis primeros contactos con el tema de node.js y JWT. Y recordando temas de HTTP.

## Lo que no entendí o me costó

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy
Sí, la usé para aclarar conceptos de la investigación y para armar la API y los ejercicios.

## Autoevaluación del tema (1-5): 4

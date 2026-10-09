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


## Lo que aprendí hoy 

## Lo que no entendí o me costó

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy

## Autoevaluación del tema (1-5): 

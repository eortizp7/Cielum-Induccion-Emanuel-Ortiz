# Bitácora Día 04 · [Postman (y alternativas)]
**Fecha: 9 de Octubre**
**Horas invertidas:** autoinvestigación  2 h · práctica  h · reto  h

## Autoinvestigación básica

1. Pregunta: Anatomía de una petición HTTP: método, URL, headers, query params, body.

Respuesta: Basicamente es una peticion que el cliente le hace al servidor para pedirle algo. Esta conformada por varias partes: El metodo nos dice la acción a realizar, la url nos dice donde queremos realizar esa acción, los headers es infomarción extra sobre la petición que puede ser necesaria. Los query params son como filtros adicionales que se agregan a la petición aplicados a los datos mismos. Y el body son los datos que se envían en la petición. 

Ejemplo: http://localhost:3000/pedidos?estado=pagado&pagina=2&limite=10
   Aqui tenemos en orden: Protocolo, el host con el puerto, la ruta, y despues del ? que es el separador, los query params.

Fuente: What is a URL?, MDN


2. Pregunta: Colecciones, carpetas y entornos en Postman.

Respuesta: Una colecicón en Postman es donde se guardan y organizan las peticiones de las APIS para poder encontrarlas facil, compartirlas y probarlas. Dentro de ellas se usan carpetas para manterlas ordenadas y separadas correspondiendo a sus relaciones, mas que todo por orden y accesibilidad. Un entorno es un conjunto de variables con su valor, usadas para no tener que cambiar el valor en cada una de las pruebas sino simplemente usar la variable y que se ejecute con el valor que tiene en el entorno. Asi no cambiamos un valor 30 veces en cada prueba, sino una vez en la variable. 

Fuente: Create and manage request collections, Postman Docs.


3. Pregunta: Variables (globales, de colección, de entorno) y su prioridad.

Respuesta: En postman tenemos variables donde guardamos valores para poder reutilizarlos, estas variables se pueden distinguir segun du alcance. Tenemos globales (todo el espacio de trabajo), colección(solo de esa colección), entorno(solo para el entorno activo en ese momento), archivos y locales, que son para esa ejecución que este corriendo. Estas variables pueden funcionar según prioridad, en caso de que dos tengan el mismo alcance. La prioridad es de la mas especifica a la mas general, desde local siendo la de mayor prioridad y global la de menos, y en ese mismo orden las demás. 

Fuente: Store and reuse values using variables, Postman Docs.


4. Pregunta: Tipos de autenticación: API Key, Bearer Token, Basic, OAuth 2.0.

Respuesta: Una API key, es una llave fija que se manda en un header o en la URL. Bearer token, es un token que se obtiene al iniciar sesión y que mandamos para poder continuar. OAuth 2.0, es un protocolo para que otra aplicación acceda a mi cuenta desde otro servicio con un token, sin darle la contraseña. Y el basic es simplemente usuario y contraseña enviados en el header en base64. 

Fuente: Authorization types supported by Postman, Postman Docs. 


5. Pregunta: Alternativas: Bruno, Insomnia, Thunder Client y curl.

Respuesta:  Bruno guarda las colecciones como archivos de texto en mi carpeta, así van a Git con el código. Insomnia es un cliente visual de código abierto parecido a Postman, que soporta REST, GraphQL y gRPC. Thunder Client es una extensión que corre dentro de VS Code, para pruebas rápidas. curl es una herramienta de línea de comandos, sin interfaz, que sirve para scripts y servidores, donde -H es un header, -d es el body y -X el método. 

## Autoinvestigación avanzada

1. Scripts pre-request y post-response (tests) con pm.test y pm.expect.

En postman se pueden ejecutar scripts de JS en dos momentos, pre-request y post-request. EL primero corre antes de la petición para preparar el entorno, como dejar valores en variables o aramar parametros, y el siguiente corre despues de que llega la respuesta de la petición y es donde se escriben los test. Los resultados salen en la pestaña Test Results y basicamente sirven para evaluar las respuestas de las peticiones. Los test se definen con pm.test y adentro se compararn contra pm.expect. 

2. Guardar el token del login automáticamente en una variable.

Para no tener que completar el token a mano, se hace un script, post-response para guardar el token en una variable pm.environment. Luego en las demás peticiones, se usa el {{token}} y Postman lo reemplaza con pm.environment.set. Se guarda en el entorno local para que cada entorno o docker tenga el suyo. 

3. Collection Runner y ejecuciones con archivos de datos (CSV/JSON).

El collection runer corre una colección de peticiones a la vez, en el orden y de la forma que yo elija y muestra los resultados de los tests en tiempo real. Adicionalmente se le pude dar un JSON o un CSV para que corra las peticiones por fila o con los datos que tenemos ahí. 

4. Newman (ejecutar colecciones desde consola y en CI) y reportes HTML.

Newman es una version de postman para ejecutar desde la terminal corre una colección exportada con newman run coleccion.json, sin abrir la app. Con -e cargo un entorno, con -d un CSV o JSON de datos, con -n cuántas veces repetir y con -r elijo los reportes. El reporte HTML no viene incluido: se instala aparte (newman-reporter-html o htmlextra). Como corre desde la terminal, se puede meter en un script de package.json (npm run test:api). 

5. Mock servers y documentación publicada.

Un mock server es una API simulada que se usa mientras la API real no esta terminada, responde con ejemplos guardados en cada petición. Sirve basicamente para seguir con otros procesos mientras se termina el backend real. Y solo funciona con peticiones HTTP, puede ser público o privado. 
La documentación publicada se genera automáticamente desde la colección (endpoints, parámetros, headers, ejemplos y autenticación) y, al publicarla, queda accesible para cualquiera que tenga el enlace, se publican también los valores compartidos de las variables del entorno, así que hay que revisar que no vayan contraseñas ni tokens. Por defecto la documentación es privada.

## Lo que aprendí hoy 


## Lo que no entendí o me costó


## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|


## Uso de IA hoy


## Autoevaluación del tema (1-5): 4

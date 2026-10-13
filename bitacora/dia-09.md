# Bitácora Día 09 · [Docker y Docker Compose]
**Fecha: 13 de Octubre**
**Horas invertidas:** autoinvestigación  3 h · práctica  h · reto  h

## Autoinvestigación básica
1. Pregunta: Contenedor vs máquina virtual.

Respuesta: Un contenedor es un proceso aislado en el pc que corre todo lo necesario para levatar un sistema (la app, librerías, bases de datos y sus archivos) pero que sigue usando el mismo núcleo o kernel del sistema operativo donde se corre. Una máquina virtual trabaja levanta todo, desde la app y sus librerías hasta el sistema operativo, emulando un computador completo. Por esta razón, aunque las dos sirvan para aislar una aplicación, es mas pesada una máquina virtual que un contenedor.

2. Pregunta: Imagen, contenedor, capa, registro (Docker Hub).

Respuesta: La imagen es como el paquete estandarizado que trae todo lo necesario para correr la app. Si editamos algo o cambiamos algo, se crea una nueva, lo que las hace inmutables. La imagen es lo que subimos al Dokcer Hub, enviando todo lo necesario para  correr la app correctamente. Un contenedor es cuando tenemos una imagen en ejecución, es efímmero y todo lo que corremos ahi se borra, de una misma imagen podemos tener varios contenedores. Las capas son los cambios que hacemos sobre una imagen, agregar, borrar o modificar archivos. Esas capas se apilan para formar la imagen, y son las que nos permiten partir de una imagen existente y agregarle cosas nuestras. El registro es básicamente el lugar donde se guardan y se distribuyen las imágenes, el mas usado es Docker Hub.  
   

3. Pregunta: Comandos: run, ps, logs, exec, stop, rm, images, rmi, pull, build.

Respuesta: Para entender los comandos mas fácilmente podemos separarlos en los de imagen y contenedores. 

   -Comandos con imagen
      docker pull imagen:tag : Descarga una imagen desde un registro, si ya se tiene capas compartidas se baja lo que falta de la imagen. 
      docker images : Lsita de imagenes descargadas o construidas.
      docker build -t nombre:tag . : Construye una imagen a partir de un dockerfile. -t le da el nombre y . es la ruta del directorio que se usa para construir. 
      docker rmi imagen : Borra la imagen del equipo (remoto), no la del registro. 

   -Comandos con contenedores 
      docker run imagen :  Crea un contenedor nuevo y lo arranca, si la imagen no esta en el equipo la descarga. 
      docker ps : Muestra la lista de contendores en ejecución. 
      docker logs contenedor : Muestra lo que el contenedor ha escrito en consola. 
      docker exec  : Ejecuta un comando dentro de un contenedor que se esta corriendo.  
      docker rm contenedor : Lo borra, no se pueden borrar los que estan ejecución. 

   run vs exec: run crea un contenedor nuevo a partir de una imagen, y exec trabaja sobre uno que ya existe y está corriendo.
   stop vs rm: stop solo lo apaga, y sigue existiendo. rm lo elimina. Para borrar uno hay que detenerlo primero, o usar -f.
   rm vs rmi: rm borra contenedores, y rmi borra imágenes. Se borra primero el contenedor y después la imagen.
   Volúmenes con nombre: docker rm -v no los toca. 

4. Pregunta: Puertos, variables de entorno y volúmenes.

Respuesta: Debido a que un contenedor esta aislado, escucha mediante su propio puerto que desde afuera no se ve. Con -p se conecta un puerto de mi maquina con uno de mi computador, haciendo asi que lo que llegue al puerto de mi pc, docker lo envie al puerto del contenedor. Las variables de entorno son la forma en que le pasamos datos al contenedor para iniciarlo sin necesidad de que la imagen los traiga, datos como usuarios, contraseñas, nombre de la base de datos. Los volúmenes son datos que viven fuera del contenedor pero que pueden sobrevivir, sirve para que datos como por ejemplo los de la base de datos, sobrevivan entre contenedores. 

5. Pregunta: ¿Qué es Docker Compose?

Respuesta: Docker compose se usa debido a que un proyecto no es únicamente un contenedor, son varios contenedores. Para poder correrlos tendriamos que lanzar varios comandos por separardo. Con docker compose, unimos todo como si fuera uno solo, describiendo todo en un archivo YAML, corriendo asi uno solo. Este archivo se sube al repositorio para que las demas personas lo corran igual.  


## Autoinvestigación avanzada

1. Dockerfile: FROM, WORKDIR, COPY, RUN, CMD vs ENTRYPOINT, EXPOSE, ENV, ARG.

EL dockerfile es el documento de texto que se usa para crear una imagen, es la base. 
-FROM es la imagen base sobre la cual estamos trabajando. 
-WORKDIR es el directorio de trabajo dentro de la imagen. 
-COPY Copia archivos de una imagen a otra. 
-RUN se usa para ejecutar comandos durante la construcción. 
-CMD es el comando por defecto para arrancar el contenedor. 
-EXPOSE Documenta en que puerto escucha la app.
-ENV Define variables de entorno. 
-ARG Define variables solo para el build. 

RUN vs CMD: RUN pasa una sola vez, cuando se construye la imagen. CMD pasa cada vez que se arranca un contenedor.
ARG son variables del build: no existen en los contenedores creados desde la imagen. ENV persiste en los contenedores que se crean desde la imagen.

2. Caché de capas y orden de instrucciones; .dockerignore.

Cada que hacemos un cambio se crea una nueva imagen, y la creación de imagenes tarda, es por esto que docker tiene un caché de las capas sobre los comandos ejecutados, evitando que cada build 
repita todo desde cero. Debido a esto, docker ejecuta las instrucciones en orden y cada una deja una capa, antes de ejecutar una mira si ya se ejecuto una igual antes, y asi no lo repite sino que reutiliza. 

Si algo cambia en una de las capas, según la regla de la cascada, esa y las demás que viene después también se invalidan. Por esta razón es importante el orden, se copian y se instalan primero las dependencias y al final el resto del código. Así, cambiar el código no obliga a reinstalar las dependencias porque esas capas siguen en caché. 

El .dockerignore es un archivo de build que excluye archivos y carpetas del contexto, lo que acelera el build evitando que dependencias locales invaliden el copy o que hayan archivos no deseados o secretos en la imagen. 

3. Builds multi-stage.

Debido a que para la construcción se usan muchas cosas que no son necesarias para la ejecución y mandarlas en la imagen es innecesario, se hace un build multi-stage, dividiendo el dockerfile en varias etapas. 
Cada From inicia una nueva, y con COPY se copian a la etapa final solo los archivos necesarios desde una etapa anterior. En una primera etapa se prepara y construye la app con todas las herramientas necesarias y la imagen final lleva únicamente lo necesario para ejecutarla.  

4. Redes en Docker y cómo se ven los servicios entre sí por nombre.

Compose crea una red interna para conectar los servicios. Dentro de esa red los contenedores acceden a los servicios por nombre y no por la IP porque la IP cambia cuando un contenedor se recrea. Hay dos formas de conectarse entre servicios: entre servicios dentro de la red se usa el nombre del servicio y el puerto del contenedor, y desde la maquina que esta afuera se usa localhost con el puerto publicado. 

5. healthcheck y depends_on con condición.

depend_on controla el orden en que arrancan y se apagan los servicios, pero no espera a que estos esten listos. Únicamente espera a que esten corriendo pero no a que esten listos para recibir peticiones. Para esto usamos healthcheck. Lo definimos en el servicio del que se depende, y en el servicio que depende se usa depends_on con service_healthy. Asi la API espera que este realmente listo para recibir peticiones. 

6. Seguridad: no correr como root, no meter secretos en la imagen, imágenes pequeñas (alpine/slim).

 Al correr un contenedor, se corre como root, lo que hace que los comandos se ejecuten como administrador. Para evitar esto, con el comando USER se crean usuarios sin esos privilegios, y con el que corre los comandos siguientes y el proceso inicial. 
 Por otro lado, ni ARG, ni ENV sirven para guardar secretos porque quedan expuestos en la imagen final y en el historial. Para los secretos durante el build se usan secret mounts, que se montan temporalmente y no quedan en la imagen. Y para los secretos de ejecución, se pasan al arrancar el contenedor y no se copian dentro de la imagen.  
 Adicionalmente, conviene usar una imagen base mínima, para tener menos tamaño y menos vulnerabilidades, y fijar la versión de la imagen base, porque los tags son mutables y pueden apuntar a otra imagen con el tiempo.  

## Lo que aprendí hoy 

Hoy tuve un contacto mas real con el tema de docker, entiendo mejor como fuciona y para que se usa. 

## Lo que no entendí o me costó

Aunque hoy profundizamos mas docker, me cuesta mucho los comandos y entender cada paso. Entiendo mas de generalidades y reconozco las cosas pero no procedimientos completos o paso a paso desde cero. 

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|


## Uso de IA hoy

Sí, la usé para aclarar conocimientos de la investigación y cosas que no entendia y para ayudarme en todo el tema practico del día de hoy, que nunca había trabajado con nada relacionado. 


## Autoevaluación del tema (1-5): 4


```markdown
# Bitácora Día 01 · [Git básico]
**Fecha:30 de Septiembre**
**Horas invertidas:** autoinvestigación 2 h · práctica  1  h · reto 1 h

## Autoinvestigación básica
1. Pregunta: ¿Qué es un sistema de control de versiones y por qué Git es "distribuido"?
   Respuesta: Un sistema de control de versiones se encarga basicamente de administrar las versiones de un desarrollo en especifico, permitiendo a sus usuarios moverse entre las distintas versiones del desarrollo. Git es un sistema distribuido debido a que no solo guarda las versiones en servidores, tambien permite que a la hora de clonar un proyecto, se tengan todas las versiones disponibles, logrando que los clientes tengan todo el tiempo acceso a completo. 
   Ejemplo propio: Cuando varios desarrolladores estan trabajando en un proyecto y van descargando las versiones para ver que hizo un compañero en la pasada, y en caso de no tener conexion, usan las guardadas en su equipo.
   Fuente:git-scm.com/book/es

2. Pregunta: ¿Qué diferencia hay entre working directory, staging area y repositorio?
   Respuesta: Repositorio es donde se almacena toda la informacion de los commits, donde se almacena el proyecto y sus versiones. Working directory, es la copia que se modifica donde se realizan los cambios que van a esperar en el staging area para ser cargados en un commit al repositorio. 

   Ejemplo propio: Yo tengo un proyecto en git (repositorio), lo modifico y le hago cambios (working directory) y estos quedan pendientes para subirse mientras termino de hacer cambios y hago el commit (staging area).
   Fuente:git-scm.com/book/es

3. Pregunta: ¿Para qué sirven git init, clone, status, add, commit, log, diff,        
   push, pull?
   Respuesta: 
   git init: crea un repositorio nuevo con todos los archivos necesarios.
   clone: sirve para clonar un reporsitorio existente. 
   status: sirve para ver el estado actual del repositorio. (Rama, archivos, cambios..)
   add : sirve para comenzar a rastrar un archivo y para preapararlo.
   commit : sirve para confirmar cambios. 
   log : sirve para ver el historial de commits. 
   diff : sirve para ver lo que se ha cambiado pero no se ha preparado.
   push : sirve para cargar el proyecto al servidor (subir los commits). 
   pull : sirve para traer los cambios y aplicarlos. 
   Ejemplo propio: --
   Fuente:git-scm.com/book/es

4. Pregunta: ¿Qué es un remoto y qué es origin?
   Respuesta: Los remotos son versiones del proyecto que estan en otro lugar y origin es el nombre que git da por defecto al servidor del que se clonó, 
   Ejemplo propio: Por ejemplo cuando clonamos un proyecto remoto en el servidor y la terminal aparece como origin de donde lo clonamos.
   Fuente:git-scm.com/book/es

5. Pregunta: ¿Para qué sirve .gitignore? Da 5 ejemplos de qué NO se debe subir.
   Respuesta: git ignore sirve para especificar los archivos que no se quiere rastrar ni subir. 
   Ejemplo propio: Archivos como credenciales, conexiones a bases de datos, temporales, dependencias y archivos de compilaciones, etc.
   Fuente:git-scm.com/book/es


## Autoinvestigación avanzada
1. ¿Qué es Conventional Commits y por qué ayuda en equipo?

Es una convención para los mensajes de los commits, buscan plantear reglas para que los mensajes de los commits proporcionen informacion explicita, que permitan la creacion de herramientas automatizadas.

2. ¿Cómo se configura una llave SSH para GitHub y por qué es mejor que usuario/contraseña?

Es mejor que usuario y contraseña porque de ese modo, esa información viaja en cada autenticación, mientras que con el protocolo SSH la llave pública es la unica que viaja, mientras que la privada no, lo que da como resultado mas seguriad. 

3. ¿Qué es git config --global y qué debe tener configurado un desarrollador?

Es un comando para configurar informacion general para todos los repositorios, por ejemplo el correo y el nombre, para que se reflejen en todos los commits que se hagan en cualquuier repositorio. 


## Lo que aprendí hoy 

-Que es SSH y como configurarla. Conventional commits y comandos generales de git. 

## Lo que no entendí o me costó

-El orden en que se usan todos los comandos y memorizar cada comando. 

## Errores que tuve y cómo los resolví
| Error | Causa | Solución |
|Problemas al aplicar la SSH con power shell| Normalmente se hace en git bash |Consultando con la IA|

## Uso de IA hoy
- Si, la use para todo el procesod de la SSH y su configuracion. Tambien para que me generar los archivos de repositorio, los textos. Aprendí a usar los comandos para el tema de las llaves y como configurarlo.  


## Ejercicios

- Usar git log --oneline  / --graph
--oneline muestra en una sola linea los commits que se hicieron y --graph muestra autor fecha y los docs de los commits. 

- Usar git diff --staged
--cuando lo probe no me mostro nada porque ya habia hecho los commits, pero entiendo que muestra las lineas de los cambios que se les hizo el add pero que no se ha hecho el commit. 

- Usar git commit --amend 
--lo use y corregi como mensaje de prueba en uno de los ultimos commits que realicé. 


## Autoevaluación del tema (1-5): 4
```

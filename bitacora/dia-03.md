# Bitácora Día 03 · [JavaScript intermedio y avanzado]
**Fecha: 2 de Octubre**
**Horas invertidas:** autoinvestigación 4 h · práctica 2 h · reto 2 h

## Autoinvestigación básica
1. Pregunta: ¿Qué es el scope y qué es un closure? Da un ejemplo.
Respuesta : Scope es como desde donde se puede ver una variable y desde donde puede ser usada. Si en una función se crea una variable, puede ser vista o usada desde ahi. Asi evitamos conflictos con funciones que tienen variables iguales. Y closure es cuando una función tiene acceso a las variables en donde fue creada. 
Ejmeplo : Si creamos una variable en una función, no podemos acceder desde fuera, pero si creamos una variable y una función dentro de la misma, la funcion que creamos puede acceder a esa variable y usarla, como si fuera una puerta de acceso. 

Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Closures

2. Pregunta : ¿Cómo funcionan las clases en JS (class, constructor, herencia con extends)?
Respuesta : Las clases son como moldes para crear cosas iguales a partir de la plantilla (clase), estos objetos nuevos de una clase se crean a traves de un metodo llamado (constructor). Adicionalmente, una clase puede compartir atributos con una clase padre (herencia), permitiendo asi no escribir código innecesario. 
Ejemplo : Una clase proudcto, con sus atributos y una funcion llamada venta, de esa podemos heredar los atributos de producto para crear una nueva que se llame productoOferta, que tendria los mismo artributos de producto pero le agregamos uno nuevo que se llame descuento. 

Fuente: 
https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes

3. Pregunta : ¿Qué es JSON y cómo se usan JSON.parse y JSON.stringify?
Respuesta : JSON es como un formato de texto por medio del cual viajan los datos y los podemos usar. 
   -JSON.parse : se usa para convertir del formato JSON al objeto en JS.
   -JSON.stringify : se usa para convertir el objeto de JS en un texto JSON. 

Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON

4. Pregunta : ¿Qué es el DOM y cómo se seleccionan y modifican elementos?
Respuesta : El DOM es la representación del HTML que podemos modificar mediante JS, es lo que el navegador nos muestra como resultado del HTML escrito en la pagina en la que estamos, en el cual podemos acceder a sus elementos mediante codigo. 

 -Seleccionar elementos 
   document.querySelector("#titulo") -> con este accedemos al primer elemento que coincida. 
   document.querySelectorAll(".texto") -> con este accedemos a todos los que coincidan. 
 
 -Modificar elementos
   titulo.textContent = "Nuevo texto" -> cambia el texto
   titulo.style.color = "blue"  ->   cambia estilos
   titulo.classList.add("destacado") ->   agrega una clase CSS

Fuente: https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction

5. Pregunta : ¿Qué son los módulos ES (import/export)?
Respuesta : Los modulos ES es la forma en que JS permite separar el codigo, importandolo y exportandolo para poder conectar los modúlos de codigo. Permitiendo tener un codigo ordenado con arquitecturas limpias. 

Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules


## Autoinvestigación avanzada

1. ¿Cómo funciona el event loop? Diferencia entre call stack, task queue y microtask queue.

Como JavaScript de ejecuta en orden, como un solo hilo. Se usa el event loop para manjear las tareas que tardan o que deben esperar algo externo. CallStack es donde se ejecuta el código, en orden y como se escribió. Task queue son las tareas que esperan a que les toque su turno, cuando el callstack queda vacío. Microtask son las tareas a las que se les da prioridad, ahi van las promesas por ejemplo, y estas se ejecutan antes de seguir con el flujo normal. 

2. Callbacks → Promesas → async/await: ¿qué problema resuelve cada uno?

Los tres partes la necesidad de ejecutar funciones o codigo de manera asincronico. Los Callbacks son la primera forma natural pero termina volviendose anindado, lo que en un código grande se vuelve ilegible. Las promesas con .then resuelven el anidamiento haciendo un poco mas legible el codigo. Pero los async/await resuelven la legibilidad del codigo, haciendolo mas sencillo y entendible a la vista. 

3. Promise.all, Promise.allSettled, Promise.race: ¿cuándo usar cada uno?

Cuando tenemos varias promesas, podemos decidir como se van a comportar. 
 -.all es cuando necesitamos que todas las promesas se cumplan para poder seguir, se usa cuando es necesario que todo se cumpla para que tenga logica seguir. 
 -.all.Settled se usa cuando se llaman todas las promesad a la vez pero podemos seguir si alguna falla, no cancela el flujo como en el anterior sino que devuelve un fulfilled o rejected. 
 -.race depende de la primera que llegue. Como si fuera una carrera. 

4. ¿Cómo se manejan errores en código asíncrono?

Cuando se usa .then() el try catch no funciona, entonces se usa .catch al final para que atrape los errores anteriores del .then(). Distinto a cuando usamos async/await que nos permite recuperar el uso del try catch ya que es el flujo normal del codigo, simplemente parandolo cuando pasa por la promesa. 

5. ¿Qué es this y cómo cambia en funciones flecha?

EL this es como un marcador generico que se usa porque no saemos cuantos objetos ni que nombres van a tener cuando se creen los objetos de esa clase, entonces se usa el this para como un generico para solucionar eso. El problema es que depende de donde se llame, si es una función normal es generico y cambia según quien lo llame, en una función flecha no. Es fijo según cuando se llamó. Esto se usa para no perder el this si se encesita usar una función intermedia. 

## Lo que aprendí hoy 
Todo el tema de programación asyncronica y sincronica. Y todo el tema de clases. 

## Lo que no entendí o me costó

El ejercicio propuesto no lo entendí muy bien y tuve que hacerlo con apoyo de la IA. 

## Errores que tuve y cómo los resolví
| Error | Causa | Solución |


## Uso de IA hoy
- Si, usé la IA para poder desarrollar el ejercicio propuesto y entender temas que me habian costado comprender. 


## Ejercicios

Construí un script de Node.js que consume los endpoints /users y /posts de jsonplaceholder.typicode.com, combina la información, y genera un reporte con el nombre de cada usuario, su ciudad, y la cantidad de posts que tiene.

## Autoevaluación del tema (1-5): 4
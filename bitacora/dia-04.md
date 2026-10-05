# Bitácora Día 04 · [Python básico a avanzado]
**Fecha: 5 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 3 h · reto 2 h

## Autoinvestigación básica
1. Pregunta: Tipos de datos, listas, tuplas, diccionarios, sets: ¿cuándo usar cada uno?
   Respuesta: En python tenemos varios tipos de datos.
         -listas : es como un arreglo de JS, un conjunto ordenado de datos que se puede editar y que se puede recorrer mediante el inidice que le corresponde a cada uno. 
         -tuplas : es como una lista, sin embargo, esta no se puede editar, es un conjunto de datos fijo, que admite repetidos y al que se puede acceder mediante un indice, pero donde no se pueden editar los datos. 
         -diccionarios : es un conjunto de datos a los que se accede por nombre y no por indice, se puden editar, admite datos repetidos pero no claves repetidas.
         -set: Es una colección de elementos que son únicos y no tienen orden. 

   Ejemplo propio: Una lista la podemos usar cuando tenemos muchos elementos que vamos agregar y que necesitamos recorrer, un tupla cuando tenemos elementos fijos que sabemos que no van a cambiar, diccionarios cuando tenemos un elemento con varias propiedades o datos correspondientes y el set cuando queremos eliminar reptidos y no necesitamos que esten ordenados. 

   Fuente:docs.python.org/es/3/tutorial

2. Pregunta: Funciones, parámetros por defecto, *args y **kwargs.
   Respuesta: 
      -Funciones : Son basicamente bloques de codigo que cumplen una función especifica que sabemos que necesitaremos varias veces y para no volver a escribirlos los definimos como función y los llamamos cuando necesitemos. 
      -Párametros por defecto : A los parametros les puedemos dar un valor por defecto, en caso de que llamen un párametro y no le den un valor nuevo se usa ese que se le asignó por defecto. 
      -*args : Se usa para cuando no sabemos cuantos valores van a llegar, entonces lo marcamos con el * y asi Python los recibe todos y los guarda en una tupla. 
      -**kwargs : es la forma en que le decimos a la función que puede recibir cualquier cantidad de datos con nombre, python los recibe y los vuelve como diccionario. 
      Fuente : docs.python.org/es/3/tutorial

3. Pregunta : ¿Qué es un entorno virtual (venv) y por qué se usa? ¿Qué es requirements.txt?
   Respuesta : Un entorno virtual es como un carpeta aislada, un entorno aislado dentro del computador que se usa para proyectos especificos, esto permite manejar un proyecto con una version determianda de python o de ciertas librerias, evitando conflictos con los descargados en el computador o los que se usan para otros proyectos. El requirements.txt se usa para especificar las librerías y versiones que tiene el proyecto y que son necesearias para correrlo. Esto evita por ejemplo, tener que subir todo eso a git. 

   Fuente : docs.python.org/es/3/tutorial/venv.html

4. Pregunta : Lectura y escritura de archivos, manejo de excepciones (try/except/finally).
   Respuesta : En Pyhton para abrir archivos se usa el open(), normalmente se pone en un bloque with que siempre cierra el archivo al final, para no cometer errores en caso de no cerrarlo. Usamos "r" para leer, "w" para escribir, pero borra lo que existia anteriormente. "a" para agregar al final si borrar lo que estaba antes. 

      El manejo de errores lo usamos con try, ahi va todo el bloque de codigo que puede fallar. En el except ponemos lo que debe hacer si falla, aqui podemos poner varias, una segun el tipo de error. El finalally es lo que se ejecuta si o si al final, indiferentemente de que haya error o no. 

   Fuente : docs.python.org/es/3/tutorial/inputoutput.html#reading-and-writing-files

5. Pregunta : List comprehensions y dict comprehensions.
   Respuesta : Es una forma compacta en que podemos crear una lista a partir de otra, la forma de hacerlo con listas es: [expresión for elemento in lista], también le podemos agregar condiciones al final, como para filtrar. De igual modo, podemos hacerlo con diccionarios, la forma es : {clave: valor for elemento in colección if condición}. 


## Autoinvestigación avanzada
1. POO en Python: clases, herencia, dataclasses, métodos mágicos (__str__, __repr__).

POO en Python conserva la misma esencia que en JS. Class es el molde que vamos a usar. __init__ es el constructor que se ejecuta para crear, y guarda los datos en el self, que es como el this de JS. La herencia la usamos para que una clase hija tome datos de la clase padre y agregue los suyos, y se hace de esta forma: clase hija(Padre), para retutilizar los datos lo hacemos desde el constructor con super().__init__, asi reutilizamos código y simplemente agregamos los de la clase hija. 

   Adicionalmente tenemos dos métodos que usamos para elegir como mostrar los datos, _srt_ los muestra como texto, de una forma sencilla y legible, como si lo fueramos a mostrar al cliente final. Y __repr__ nos muestra los datos técnicos, como viene el objeto, sirve mucho para depurar. 
   
   Por otro lado, tenemos @dataclass que es como un atajo de sitaxis para escribir o plantear clases de forma mas sencilla y resumida, idealmente se usa para las clases que solo guardan datos y que no tienen una lógica muy grande. 


2. Decoradores y context managers (with).

Un decorador es una función que recibe otra y le agrega contenido, logica o comportamiento pero no la modifica, como se  se ejecutara el decorador y dentro la que recibio. Para que el decorador reciba bien los parametros de la otra en caso de ser grandes aplicamos el *args y **kwargs. El with lo usamos para abrir y cerrar un recurso, evitando dejarlo abierto y cometer errores. El decorador se aplica a una función y el with lo usamos para abrir y cerrar recursos. 


3. Type hints y para qué sirven.

Los type hints se usan para indicar el tipo de variable o el resultado esperado de una función, no son obligatorios pero se usan para 
documentación, a veces se pueden usar para que herramientas ayuden a revisar el código. 


4. logging en vez de print. argparse para scripts de línea de comandos.

El logging nos sirve para dar salidas con niveles de gravedad, la hora y otros datos. Adicionalmente, nos permite guardar las salidas en un archivo. argparse nos permite que el codigo reciba archivos desde la terminal sin tener que cambiar el codigo a la hora de mandarle un archivo distinto, adicionalmente nos permite acceder a ayudas con el --help. 


5. Pruebas con pytest.

pytest sirve para probar el codigo de forma automatica, le doy entradas conocidas y con assert defino resultados esperados para que el pruebe y verifique 


6. pandas y openpyxl para manejo de datos y Excel.

Pandas es una libreria de Python que permite manejar los datos en forma de tabla. openpyxl es una libreria que permite leer y editar archivos de excel. 

## Operaciones principales de pandas

| Quiero | Código | Qué hace |
|---|---|---|
| Leer un CSV | `pd.read_csv("ventas.csv")` | Carga el archivo como tabla (`DataFrame`) |
| Ver las primeras filas | `df.head()` | Muestra las 5 primeras filas |
| Ver columnas, tipos y vacíos | `df.info()` | Resume la estructura de la tabla |
| Quitar duplicados | `df.drop_duplicates()` | Elimina las filas repetidas |
| Quitar filas con vacíos | `df.dropna(subset=["total"])` | Elimina las filas donde `total` está vacío |
| Convertir a número | `pd.to_numeric(df["total"], errors="coerce")` | Pasa texto a número; lo que no se pueda queda vacío |
| Convertir a fecha | `pd.to_datetime(df["fecha"], errors="coerce")` | Pasa texto a fecha; las fechas mal escritas quedan vacías |
| Limpiar espacios | `df["ciudad"].str.strip()` | Quita espacios al inicio y al final del texto |
| Filtrar filas | `df[df["total"] > 100000]` | Deja solo las filas que cumplen la condición |
| Agrupar y sumar | `df.groupby("ciudad")["total"].sum()` | Suma el total de cada ciudad |
| Ordenar | `df.sort_values("total", ascending=False)` | Ordena de mayor a menor |
| Quedarme con 5 | `.head(5)` | Deja solo las 5 primeras filas |
| Guardar en Excel | `df.to_excel("reporte.xlsx", index=False)` | Escribe la tabla en un archivo `.xlsx` |
| Excel con varias hojas | `pd.ExcelWriter("reporte.xlsx", engine="openpyxl")` | Permite escribir cada análisis en su propia hoja |


## Lo que aprendí hoy 

El día de hoy aprendí y reforcé conocimientos basicos de python, datos, tipos de datos, funciones y el tema del POO. Empecé a ver un poco el tema de las librerias y el manejo de archivos tipo excel. 

## Lo que no entendí o me costó

Me cuesta entender completamente todo el tema de las librerias y el manejo de los archivos y los datos. 

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|
| `pytest` no se reconocía como comando y luego `collected 0 items` | pip instaló `pytest` en una carpeta de usuario que no está en el PATH de Windows, y el archivo de pruebas todavía no existía | usé `python -m pytest -v` y creé `test_intermedio_inventario.py`, porque `pytest` solo recoge archivos que empiezan por `test_` |
| `pip.exe` bloqueado y `ImportError: DLL load failed` al importar pandas | una política de Control de aplicaciones del equipo no deja ejecutar `pip.exe` ni cargar los archivos compilados de pandas | instalé con `python -m pip install`, y para el reto usé `csv` y `openpyxl`, que sí cargan |

## Uso de IA hoy

Si, use la IA para acalarar conceptos que aun no entendia de la investigación propuesta en el día de hoy y para ayudarme a reazlizar los ejercicios del día. 

## Autoevaluación del tema (1-5): 4

# Bitácora Día 11 · [React]
**Fecha: 15 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 3 h · reto 2 h

## Autoinvestigación básica
1. Pregunta: ¿Qué es React y qué es un componente? JSX.

   Respuesta: React es una librería de JavaScript para construir interfaces con piezas reutilizables; un componente es una función que devuelve JSX, que es una sintaxis parecida a HTML escrita dentro de JavaScript.
   
   Ejemplo propio: `EstadoBadge` recibe un estado y devuelve `<span className="estado ...">`.
   
   Fuente: https://react.dev/learn

2. Pregunta: Props vs state. `useState`.
   
   Respuesta: Las props las recibe el componente de su padre y no las modifica; el state es propio, cambia con `useState` y al cambiar React vuelve a renderizar.
   
   Ejemplo propio: `EstadoBadge` usa props (`estado`); `Login` guarda `usuario` y `clave` en state.
   
   Fuente: https://react.dev/learn/state-a-components-memory

3. Pregunta: Eventos, renderizado condicional, listas y `key`.
   
   Respuesta: Los eventos se manejan con `onClick`, `onChange`, `onSubmit`; lo condicional se hace con `&&`, ternario o `return` temprano; las listas se pintan con `map` y cada elemento lleva una `key` estable para que React sepa cuál es cuál (el índice falla si se quita o reordena).
   
   Ejemplo propio: `Pedidos` muestra "Cargando", error, vacío o tabla según el estado; las filas usan `key={p.id}`.
   
   Fuente: https://react.dev/learn/conditional-rendering · https://react.dev/learn/rendering-lists

4. Pregunta: Formularios controlados.
   
   Respuesta: El input toma su `value` de un `useState` y `onChange` lo actualiza, así React y no el navegador es la fuente de la verdad de lo escrito.
   
   Ejemplo propio: el formulario de `Login` y el `BuscadorProductos` que filtra mientras escribo.
   
   Fuente: https://react.dev/learn/reacting-to-input-with-state

5. Pregunta: Crear proyecto con Vite.
   
   Respuesta: `npm create vite@latest nombre -- --template react`, luego `npm install` y `npm run dev`; Vite es la herramienta que levanta el servidor de desarrollo y compila para producción con `npm run build`.
   
   Ejemplo propio: `proyecto/frontend-react/`, que se compila en el `Dockerfile` y se sirve con nginx.
   
   Fuente: https://vite.dev/guide/


## Autoinvestigación avanzada

1. `useEffect`: dependencias, limpieza, errores comunes.
   Las dependencias deciden cuándo corre el efecto; la función que devuelve es la limpieza (se ejecuta antes de repetir y al desmontar). Errores comunes: ciclo infinito (cambiar un estado dentro del efecto sin control o usar como dependencia un objeto o función nuevo en cada render), olvidar la limpieza y dejar dependencias fuera.
   Ejemplo propio: `useDatos` pide la ruta y cancela con `AbortController` en la limpieza.
   Fuente: https://react.dev/reference/react/useEffect

2. Custom hooks (`useFetch`, `useAuth`).
   Son funciones que empiezan por `use` y reutilizan lógica con otros hooks.
   Ejemplo propio: `useApi` (agrega el token y maneja el 401), `useDatos` (mi `useFetch`: cargando, error, recargar) y `useAuth`.
   Fuente: https://react.dev/learn/reusing-logic-with-custom-hooks

3. Context API para estado global (usuario logueado).
   Comparte datos con muchos componentes sin pasar props nivel por nivel; no conviene para datos que cambian muy seguido, porque todos los consumidores se re-renderizan.
   Ejemplo propio: `AuthContext` y `AuthProvider` guardan la sesión y `useAuth` la lee.
   Fuente: https://react.dev/learn/passing-data-deeply-with-context

4. React Router: rutas, parámetros, rutas protegidas.
   Las rutas se declaran con `Routes` y `Route`; los parámetros se leen con `useParams` y los filtros con `useSearchParams`; una ruta protegida es una ruta de layout que revisa la sesión y, si no hay, redirige con `<Navigate>` (si sí hay, muestra `<Outlet />`).
   Ejemplo propio: `RutaProtegida`, `/pedidos/:id` y los filtros en la URL.
   Fuente: https://reactrouter.com

5. `useMemo`, `useCallback` y cuándo NO usarlos.
   `useMemo` recuerda un valor calculado y `useCallback` recuerda una función entre renders. Sirven si evitan un cálculo caro o estabilizan una dependencia de otro hook. No hay que usarlos por defecto: agregan complejidad y muchas veces no ahorran nada. Primero se mide.
   Ejemplo propio: `recargar` en `useDatos` va con `useCallback`.
   Fuente: https://react.dev/reference/react/useCallback

6. Estado de servidor (TanStack Query, opcional).
   Es una librería que maneja los datos que vienen del servidor: caché, recarga, cargando y error. En mi proyecto lo hice a mano con `useDatos`.
   Fuente: https://tanstack.com/query/latest


## Lo que aprendí hoy 


## Lo que no entendí o me costó


## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy
sí, lo usé  para armar la base del frontend (`proyecto/frontend-react/`), el endpoint `PATCH /pedidos/:id/estado`, los tests de Newman y el rediseño. Lo probé en mi máquina con Docker, revisé el flujo en F12 en Network.


## Autoevaluación del tema (1-5): 4

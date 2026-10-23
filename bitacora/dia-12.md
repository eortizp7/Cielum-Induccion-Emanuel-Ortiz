# Bitácora Día 12 · [Vue.js]
**Fecha: 15 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 2 h · reto 3 h

## Autoinvestigación básica

1. Pregunta: Componentes de archivo único (`.vue`): `<template>`, `<script setup>`, `<style>`.
   Respuesta: En Vue cada componente es un archivo `.vue` con tres partes. `<template>` es el HTML de lo que se ve; `<script setup>` es la lógica (datos, funciones), y todo lo que se declara ahí se puede usar en el template sin exportarlo; `<style>` son los estilos, y con `scoped` solo aplican a ese componente.
   Ejemplo propio: `proyecto/frontend-vue/src/components/EstadoBadge.vue` recibe el estado en el script y lo pinta en el template.
   Fuente: https://vuejs.org/guide/scaling-up/sfc.html

2. Pregunta: Directivas: `v-if`, `v-show`, `v-for`, `v-model`, `v-bind` (`:`), `v-on` (`@`).
   Respuesta: Son atributos especiales que le dicen a Vue qué hacer con un elemento:
   - `v-if`: lo crea o lo quita según una condición.
   - `v-show`: siempre lo crea, solo lo oculta con CSS (mejor si se muestra y oculta muchas veces).
   - `v-for`: repite el elemento por cada ítem de una lista, con `:key`.
   - `v-model`: une un input con una variable en los dos sentidos.
   - `v-bind` o `:`: pone el valor de una variable en un atributo, como `:disabled="enviando"`.
   - `v-on` o `@`: escucha un evento, como `@click="guardar"`.
   Ejemplo propio: la lista de tareas usa `v-for` para las tareas y `v-model` en el input y en cada checkbox.
   Fuente: https://vuejs.org/api/built-in-directives.html

3. Pregunta: Reactividad: `ref` vs `reactive`.
   Respuesta: Los dos hacen que Vue vigile un valor y actualice la pantalla cuando cambia. `ref` sirve para cualquier tipo (número, texto, arreglo, objeto) y en el script se lee con `.value`; en el template no hace falta el `.value`. `reactive` solo sirve para objetos, se usa sin `.value`, pero si se reemplaza el objeto completo o se desestructura, pierde la reactividad. Por eso la guía de Vue recomienda usar `ref` casi siempre.
   Ejemplo propio: en el login, `const usuario = ref('')` y en el template `v-model="usuario"`.
   Fuente: https://vuejs.org/guide/essentials/reactivity-fundamentals.html

4. Pregunta: `computed` y `watch`.
   Respuesta: `computed` es un valor que se calcula a partir de otros y se recalcula solo cuando esos cambian; se guarda en caché. `watch` ejecuta una función cuando cambia un valor; se usa para "hacer algo" (pedir datos, navegar), no para calcular.
   Ejemplo propio: el total del nuevo pedido es un `computed`. En `useDatos`, un `watch` sobre la ruta vuelve a pedir los datos cuando cambia un filtro.
   Fuente: https://vuejs.org/guide/essentials/computed.html

5. Pregunta: Props y emits.
   Respuesta: Las props son datos que el padre le pasa al hijo, y el hijo no las modifica. Los emits son eventos que el hijo le manda al padre para avisarle algo, y el padre decide qué hacer. Los datos bajan por props y los avisos suben por emits.
   Ejemplo propio: `PaginacionPedidos.vue` recibe `pagina`, `paginas` y `total` por props, y cuando tocan "Siguiente" emite `cambiar` con el número de página. `PedidosView` escucha `@cambiar` y cambia la URL.
   Fuente: https://vuejs.org/guide/components/events.html

## Autoinvestigación avanzada

1. Composition API vs Options API.
   La Options API organiza el componente por tipo de cosa: `data`, `methods`, `computed`, `watch`, cada uno en su sección. La Composition API (`<script setup>`) organiza por funcionalidad: todo lo de una misma tarea va junto y se puede sacar a una función reutilizable. La Composition API es la recomendada hoy, y es la que usé en todo el proyecto.

2. Composables.
   Son funciones que empiezan por `use` y agrupan lógica reutilizable con `ref`, `computed`, `watch` o el ciclo de vida. Son el equivalente a los custom hooks de React.
   Ejemplo propio: `composables/useApi.js` llama a la API con el token y maneja el 401, y `composables/useDatos.js` devuelve `datos`, `cargando`, `error` y `recargar`.

3. Vue Router y guardas de navegación.
   Vue Router relaciona cada URL con un componente (`routes`), y `<RouterView>` pinta el que toca. Las guardas son funciones que corren antes de entrar a una ruta y deciden si dejar pasar o redirigir. La global es `router.beforeEach`.
   Ejemplo propio: `router/index.js` marca las rutas privadas con `meta: { requiereSesion: true }`. La guarda manda al login con `?desde=` si no hay sesión, y si ya hay sesión no deja volver al login.

4. Pinia para estado global.
   Pinia es la librería oficial de Vue para compartir estado entre componentes. Un store tiene estado (`ref`), valores calculados (`computed`) y acciones (funciones). Se usa con `useAuthStore()` en cualquier componente, y también fuera de ellos, como en el router.
   Ejemplo propio: `stores/auth.js` guarda el token y el aviso, calcula el usuario y si está autenticado, y tiene `entrar()` y `salir()`. Guarda el token en `localStorage` para que la sesión sobreviva a una recarga.

5. Ciclo de vida.
   Son momentos de la vida de un componente donde se puede ejecutar código. `onMounted` corre cuando el componente ya está en pantalla (por ejemplo, para pedir datos), y `onUnmounted` cuando se quita (para limpiar o cancelar lo pendiente).
   Ejemplo propio: `ejercicios/TablaProductos.vue` carga los productos en `onMounted` y cancela la petición con `AbortController` en `onUnmounted`.

## Ejercicios

Están en `proyecto/frontend-vue/src/ejercicios/` y se ven en la pantalla **Ejercicios** del front Vue.

**Básico: lista de tareas** (`ListaTareas.vue`). Agregar, marcar y quitar tareas con `v-for` (con `:key`) y `v-model` en el input y en los checkbox. El contador de pendientes es un `computed`.

**Intermedio: tabla de productos** (`TablaProductos.vue`). Consume `GET /productos` de la API, con estados de cargando y error y un botón de reintentar. Tiene un buscador con `v-model`, y la lista filtrada es un `computed`.

**Avanzado: Pinia y guarda de ruta** (`SesionPinia.vue`, `stores/auth.js` y `router/index.js`). El store guarda el usuario y el token. La pantalla muestra lo que tiene el store, prueba una ruta protegida y simula un token inválido: la API responde 401, el store cierra la sesión y el front manda al login con el aviso "Tu sesión expiró".

## Reto del día

**Frontend Vue** (`proyecto/frontend-vue/`), con las mismas funciones que el de React:
- Login con JWT, sesión guardada en `localStorage` y cierre de sesión.
- Rutas protegidas con la guarda `router.beforeEach`.
- Listado de pedidos con filtros por estado, cantidad por página y paginación, todo en la URL.
- Detalle del pedido con la línea de avance y el cambio de estado (`PATCH /pedidos/:id/estado`).
- Crear pedidos con varios productos, total estimado y validación de stock.
- Servicio `frontend-vue` en el `docker-compose.yml` (puerto 5174), con Dockerfile multi-stage y nginx, igual que el de React.

Lo probé completo en el navegador: la guarda, el login malo y el bueno, crear un pedido, cambiar el estado, los filtros y la paginación, los tres ejercicios, el 401 y la recarga con F5. El bot RPA también funciona contra este front sin cambios.

**Comparativo** en `docs/react-vs-vue.md`: reactividad, sintaxis, estado global, rutas protegidas, curva de aprendizaje y cuándo usaría cada uno.

## Lo que aprendí hoy
Es mi primera vez con todo el tema de vue.js

## Lo que no entendí o me costó

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|

## Uso de IA hoy
Sí, la usé para pasar el front de React a Vue, armar los ejercicios y aclarar las diferencias entre los dos frameworks.

## Autoevaluación del tema (1-5): 4

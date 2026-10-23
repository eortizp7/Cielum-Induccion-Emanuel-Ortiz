# React vs Vue: lo que vi haciendo el mismo panel dos veces

Hice el panel de pedidos de la tienda dos veces: `proyecto/frontend-react/` (día 11) y `proyecto/frontend-vue/` (día 12). Los dos usan la misma API, los mismos estilos y el mismo `cliente.js`, así que la diferencia está solo en el framework.

## Tabla comparativa

| Tema | React | Vue | Lo que noté en mi proyecto |
|---|---|---|---|
| **Reactividad** | El estado se cambia con su función (`setToken(...)`) y React vuelve a ejecutar todo el componente. No se puede modificar un arreglo directo: hay que crear uno nuevo (`[...tareas, nueva]`). | Los `ref` son reactivos: se cambia `token.value = ...` y Vue actualiza solo lo que usa ese valor. Se puede hacer `tareas.value.push(...)` y Vue lo detecta. | En la lista de tareas, Vue me dejó escribir menos código. En React tuve que acordarme de no mutar el arreglo. |
| **Sintaxis** | Todo es JavaScript: el HTML va dentro de JS (JSX). Para listas uso `map`, y para condiciones `&&` o el ternario. | Archivo `.vue` con tres partes: `<template>`, `<script setup>` y `<style>`. Usa directivas: `v-for`, `v-if`, `v-model`, `:prop`, `@evento`. | Los formularios en Vue son más cortos con `v-model`. En React cada input necesita `value` + `onChange`. |
| **Valores calculados** | Se calculan en cada render, o con `useMemo` si son pesados. | `computed`: se recalcula solo cuando cambia lo que usa. | El total del pedido en Vue es un `computed`; en React es una variable que se recalcula en cada render. |
| **Efectos y ciclo de vida** | `useEffect` con su lista de dependencias y la función de limpieza. Fácil equivocarse con las dependencias. | `watch` para reaccionar a un cambio, y `onMounted` / `onUnmounted` para el ciclo de vida. | `useDatos` en Vue usa `watch` sobre la ruta; en React, `useEffect` con `[ruta]`. Me pareció más claro el `watch`. |
| **Estado global** | Context API (`AuthProvider` + `useAuth`), o librerías aparte (Redux, Zustand). | Pinia, la librería oficial: un store con `ref`, `computed` y funciones. | El store de Pinia (`stores/auth.js`) se usa en cualquier lugar con `useAuthStore()`, incluso dentro del router. Con Context no se puede usar fuera de los componentes. |
| **Rutas protegidas** | Un componente `<RutaProtegida>` que devuelve `<Navigate>` u `<Outlet>`. | Una guarda `router.beforeEach` que decide antes de entrar a la ruta. | La guarda de Vue corre solo al navegar. Para cuando la sesión se cierra estando en una pantalla, tuve que agregar un `watch` en el layout. En React eso pasa solo al cambiar el estado. |
| **Reutilizar lógica** | Custom hooks (`useApi`, `useDatos`). | Composables (`useApi`, `useDatos`). | Son casi iguales. |
| **Curva de aprendizaje** | Al principio cuesta más: hay que entender bien los renders, las dependencias de `useEffect` y por qué no se muta el estado. | Más fácil para empezar: se parece más a HTML normal y las directivas se entienden rápido. Lo que más cuesta es acordarse del `.value` en los `ref`. | Hice Vue más rápido, pero porque ya tenía la lógica hecha en React. |
| **Ecosistema y trabajo** | Más grande: más librerías, más ofertas de trabajo y más ejemplos. | Más pequeño, pero con herramientas oficiales para todo (Router, Pinia). | — |

## ¿Cuándo usaría cada uno?

- **React**: en un equipo o empresa que ya lo use, en proyectos grandes donde sirve tener muchas librerías, o si busco trabajo, porque se pide más.
- **Vue**: para un proyecto mediano o un equipo que quiere empezar rápido, o para agregar interactividad a páginas que ya existen, porque Vue se puede ir metiendo poco a poco.

## Algo que me sirvió de prueba

El bot RPA (`proyecto/rpa/reporte_pedidos.py`) funciona con los dos fronts sin cambiarle nada, solo la dirección (`FRONT_URL=http://localhost:5174`). Eso pasa porque los dos usan las mismas etiquetas, ids y marcas en la pantalla. Y la API no cambió nada: el front es un servicio aparte que se puede reemplazar.

# Frontend Vue (proyecto, parte 5)

El mismo panel de pedidos que `proyecto/frontend-react/`, hecho en Vue 3 para compararlos: login con JWT, rutas protegidas, listado de pedidos con filtros y paginación en la URL, detalle con cambio de estado y creación de pedidos con varios productos. Usa los mismos estilos (`src/index.css`) y el mismo cliente HTTP (`src/api/cliente.js`), así que la diferencia está solo en el framework.

Stack: Vue 3 (`<script setup>`, Composition API) + Vite + Vue Router + Pinia.

## Cómo correrlo

### Con Docker (todo junto)

```powershell
cd proyecto
docker compose up -d --build frontend-vue
```

- Front Vue: http://localhost:5174
- Front React: http://localhost:5173 (los dos usan la misma API)

`CORS_ORIGENES` en `api/.env` debe incluir `http://localhost:5174`.

### En desarrollo (recarga en vivo)

```powershell
cd proyecto\frontend-vue
Copy-Item .env.example .env     # VITE_API_URL=http://localhost:3001 (API en Docker) o :3000 (API con node)
npm install
npm run dev                     # http://localhost:5174
```

## Estructura

```
src/
  main.js                  crea la app, instala Pinia y el router
  App.vue                  solo <RouterView />
  router/index.js          rutas y guarda de navegación (router.beforeEach)
  stores/auth.js           Pinia: token, usuario, entrar(), salir()
  composables/useApi.js    llama a la API con el token y maneja el 401
  composables/useDatos.js  GET reactivo: datos, cargando, error, recargar
  api/cliente.js           fetch + errores (el mismo de React)
  components/              LayoutPrincipal, AvisoMensaje, EstadoBadge, FlujoEstado, PaginacionPedidos
  views/                   LoginView, PedidosView, PedidoDetalleView, NuevoPedidoView, EjerciciosView
  ejercicios/              ListaTareas (básico), TablaProductos (intermedio), SesionPinia (avanzado)
```

## Equivalencias con el front de React

| React | Vue |
|---|---|
| `AuthProvider` + Context + `useAuth` | Store de Pinia `useAuthStore` (`stores/auth.js`) |
| `<RutaProtegida>` | Guarda `router.beforeEach` + `meta.requiereSesion` (`router/index.js`) |
| Hooks `useApi` / `useDatos` | Composables `useApi` / `useDatos` |
| `useState` | `ref` |
| Valor calculado en cada render | `computed` |
| `useEffect` con dependencias | `watch` / `onMounted` |
| `value` + `onChange` | `v-model` |
| `{lista.map(...)}` | `v-for` |
| `{cond && ...}` | `v-if` |

El bot RPA (`proyecto/rpa/reporte_pedidos.py`) también funciona con este front, porque usa las mismas etiquetas, ids y marcas (`aria-busy`):

```powershell
$env:FRONT_URL = "http://localhost:5174"; python reporte_pedidos.py
```

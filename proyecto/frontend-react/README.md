# Frontend React (proyecto, parte 4)

Interfaz web para la API de la tienda: login, listado de pedidos con filtros y paginación, creación de pedidos con varios productos, cambio de estado y manejo de errores.

Stack: React 19 + Vite + react-router-dom 7. Sin librerías de estado ni de estilos: solo lo que enseña react.dev.

## Cómo correrlo

### Con Docker (todo junto)

```bash
cd proyecto
docker compose up -d --build
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

En `api/.env` el `CORS_ORIGENES` debe incluir `http://localhost:5173`. Sin eso el navegador bloquea las peticiones y la app muestra un aviso que lo dice.

### En desarrollo (recarga en vivo)

```bash
cd proyecto/frontend-react
cp .env.example .env     # VITE_API_URL=http://localhost:3001 (API en Docker) o :3000 (API con node)
npm install
npm run dev
```

Si el puerto 5173 está ocupado (por ejemplo por el contenedor), Vite usa 5174. Ese origen también tiene que estar en `CORS_ORIGENES`.

Otros scripts: `npm run lint`, `npm run build`, `npm run preview`.

## Estructura

```
src/
  main.jsx            punto de entrada (BrowserRouter + AuthProvider)
  App.jsx             tabla de rutas
  api/cliente.js      fetch + errores (ErrorApi)
  auth/               Context de sesión: AuthContext, AuthProvider, useAuth
  hooks/useApi.js     fetch con token y manejo de 401
  hooks/useDatos.js   GET con cargando / error / recargar
  components/         Layout, RutaProtegida, Paginacion, EstadoBadge, FlujoEstado, Aviso
  pages/              Login, Pedidos, NuevoPedido, PedidoDetalle, Ejercicios
  ejercicios/         Contador, ListaTareas, FormularioControlado, TablaProductos, ProbarApi (Día 11)
  utils/formato.js    moneda y fechas
```

## Dónde está cada concepto de React

| Concepto | Dónde verlo |
|---|---|
| useState / formularios controlados | `pages/Login.jsx`, `pages/NuevoPedido.jsx` |
| Listas dinámicas con `key` estable | filas de productos en `NuevoPedido.jsx` |
| useEffect + limpieza (AbortController) | `hooks/useDatos.js` |
| Hook propio | `useApi`, `useDatos`, `useAuth` |
| Context API | `auth/AuthContext.js` y `AuthProvider.jsx` |
| Ruta protegida | `components/RutaProtegida.jsx` (layout route con `<Outlet />`) |
| Filtros y página en la URL | `pages/Pedidos.jsx` con `useSearchParams` |
| Parámetros de ruta | `pages/PedidoDetalle.jsx` con `useParams` |
| Estado derivado (no duplicar estado) | `cargando` en `useDatos`, total en `NuevoPedido` |
| Manejo de errores | `api/cliente.js`, `Aviso.jsx`, 401 → vuelve a login |

## Cosas que conviene saber

- **El token** vive en `localStorage` y se manda como `Authorization: Bearer`. El JWT se decodifica en el cliente solo para mostrar el usuario; no está cifrado y la autoridad real es el servidor (si responde 401, se cierra la sesión).
- **`VITE_API_URL` se fija al compilar.** En Docker se pasa como `ARG` y queda escrita en el JavaScript final; cambiarla exige volver a construir la imagen.
- **Desde el navegador la API es `localhost:3001`**, no `api:3000`: ese nombre solo existe dentro de la red de Docker.
- **Cambiar estado** usa `PATCH /pedidos/:id/estado` (endpoint nuevo). Cancelar un pedido NO devuelve el stock; la interfaz lo avisa. Es una decisión de diseño pendiente.

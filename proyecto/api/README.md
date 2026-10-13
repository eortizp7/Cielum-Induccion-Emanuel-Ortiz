# API de la tienda (Cielum - Inducción)

API REST en Node.js + Express sobre PostgreSQL. Gestiona productos, clientes y pedidos, con login JWT.

## Requisitos
- Node.js 18 o superior
- PostgreSQL con la base `tienda` (modelo en `semana-1/sql/modelo_postgres.sql`)

## Cómo correrla
1. Instalar dependencias: `npm install`
2. Crear el archivo de entorno: `Copy-Item .env.example .env` y completar los valores
3. Arrancar: `node index.js`
4. Comprobar: `GET http://127.0.0.1:3000/salud` responde `{ "estado": "ok", ... }`

## Variables de entorno
| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto de la API (por defecto 3000) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los tokens (largo y aleatorio, nunca se sube al repo) |
| `JWT_EXPIRA` | Vigencia del token, por ejemplo `1h` |
| `ADMIN_USUARIO`, `ADMIN_CLAVE` | Credenciales del usuario administrador |
| `CORS_ORIGENES` | Orígenes del frontend permitidos, separados por coma |

## Autenticación
1. `POST /auth/login` con `{ "usuario": "...", "clave": "..." }` devuelve un token.
2. Las rutas protegidas piden el encabezado `Authorization: Bearer <token>`.
3. El token vence según `JWT_EXPIRA`; después hay que volver a iniciar sesión.

## Endpoints
| Método | Ruta | Token | Descripción |
|---|---|---|---|
| GET | `/salud` | No | Estado de la API |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/productos`, `/productos/:id` | No | Listar y consultar productos |
| POST | `/productos` | Sí | Crear producto |
| PUT | `/productos/:id` | Sí | Editar producto |
| DELETE | `/productos/:id` | Sí | Eliminar (borrado lógico) |
| GET | `/clientes` | No | Listar clientes |
| POST | `/clientes` | Sí | Crear cliente |
| POST | `/pedidos` | Sí | Crear pedido con detalle (transacción) |
| GET | `/pedidos?estado=&pagina=&limite=` | Sí | Listar con filtro y paginación |
| GET | `/pedidos/:id` | Sí | Pedido con su detalle |

### Crear un pedido
```json
{ "cliente_id": 1, "notas": "opcional", "items": [ { "producto_id": 1, "cantidad": 2 } ] }
```
Si algún producto no tiene stock suficiente, no se guarda nada (rollback) y responde `409`.

## Errores
Siempre con el formato `{ "error": "mensaje" }`: `400` datos inválidos, `401` token o credenciales inválidos, `404` no encontrado, `409` conflicto (stock insuficiente, SKU o email repetido), `500` error interno.

## Pruebas
La colección de Postman está en `proyecto/postman/`.
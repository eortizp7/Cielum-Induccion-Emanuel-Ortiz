# Los 3 endpoints principales con curl

La API debe estar corriendo (por defecto en `http://127.0.0.1:3000`; en Docker, `http://127.0.0.1:3001`).
Credenciales de la API: las que estén en tu `.env` (`ADMIN_USUARIO` y `ADMIN_CLAVE`).

## 1. Login: obtener el token

```bash
curl -s -X POST http://127.0.0.1:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","clave":"<tu_clave>"}'
```

Respuesta esperada (200):

```json
{ "token": "eyJhbGciOi...", "tipo": "Bearer", "expira_en": "1h" }
```

Con credenciales malas responde `401` y sin datos responde `400`.

## 2. Listar productos (público)

```bash
curl -s http://127.0.0.1:3000/productos
```

Respuesta esperada (200): un arreglo de productos con `id`, `nombre`, `precio` (número) y `stock`.

## 3. Crear un pedido (requiere token)

```bash
curl -s -X POST http://127.0.0.1:3000/pedidos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"cliente_id":1,"items":[{"producto_id":1,"cantidad":1}]}'
```

Respuesta esperada (201): el pedido con su `total` y la lista de `items`.
Sin token responde `401`; sin stock suficiente, `409`; con un cliente que no existe, `404`.

## Nota para PowerShell

Windows PowerShell maneja distinto las comillas dentro de los argumentos. Para evitar problemas,
usa `curl.exe` (no `curl`, que es un alias de otro comando) y manda el cuerpo desde un archivo:

```powershell
Set-Content -Path login.json -Encoding ascii -Value '{"usuario":"admin","clave":"<tu_clave>"}'
curl.exe -s -X POST http://127.0.0.1:3000/auth/login -H "Content-Type: application/json" -d "@login.json"
```

# n8n: pedidos de la tienda → Zoho CRM (parte 7)

Cuando la API crea un pedido, avisa a n8n por un webhook. n8n busca al cliente en Zoho CRM, lo crea o lo actualiza, deja el resultado en la tabla `log_integraciones` de PostgreSQL y manda un correo.

```
 Front ──► API (:3001) ──► POST webhook ──► n8n (:5678) ──► Zoho CRM
            │ guarda el pedido                │ valida · token · busca · crea/actualiza
            ▼                                 ├─► PostgreSQL: log_integraciones
         PostgreSQL                           └─► correo (Mailpit :8025)
```

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `pedido-a-zoho.json` | Flujo del reto: Webhook → validar → Zoho → log → correo, con reintentos y manejo de errores |
| `error-workflow.json` | Error Workflow: avisa por correo cuando falla cualquier flujo que lo tenga asignado |
| `basico-http-a-archivo.json` | Ejercicio básico: Manual Trigger → HTTP Request → archivo `salida/productos.json` |
| `log_integraciones.sql` | Tabla donde queda el resultado de cada intento |
| `salida/` | Carpeta donde n8n puede escribir archivos (se ve como `/files` dentro del contenedor) |

## Puesta en marcha

Desde la carpeta `proyecto` (PowerShell):

**1. Variables** en `proyecto/.env` (el archivo no se sube al repositorio):

```powershell
Add-Content .env ""
Add-Content .env "N8N_ENCRYPTION_KEY=$([guid]::NewGuid().ToString('N'))$([guid]::NewGuid().ToString('N'))"
Add-Content .env "PEDIDOS_WEBHOOK_SECRET=$([guid]::NewGuid().ToString('N'))"
```

Para Zoho (credenciales de un Self Client nuevo, sin pegarlas en chats ni en el repositorio) agrega a mano en `.env`: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` y `ZOHO_REFRESH_TOKEN`. El refresh token sale de la petición 0 de la colección `zoho-crm` de Postman.

**2. Tabla de logs.** En una base nueva se crea sola. Si tu volumen de Postgres ya existía, aplícala una vez:

```powershell
Get-Content n8n\log_integraciones.sql -Raw | docker compose exec -T postgres psql -U postgres -d tienda
```

**3. Levantar todo:**

```powershell
docker compose up -d --build
```

**4. Entrar a n8n** en http://localhost:5678 y crear la cuenta de propietario (es local, sirve cualquier correo y clave).

**5. Crear las dos credenciales** (menú *Credentials* → *Add credential*):

| Nombre | Tipo | Datos |
|---|---|---|
| `Postgres tienda` | Postgres | Host `postgres`, Database `tienda`, User `postgres`, Password = tu `DB_PASSWORD`, Port `5432`, SSL `disable` |
| `SMTP Mailpit` | SMTP | Host `mailpit`, Port `1025`, User y Password cualquiera (por ejemplo `n8n`), SSL/TLS apagado (si falla, activa *Disable STARTTLS*) |

**6. Importar los flujos.** Crea un workflow vacío y usa el menú `⋯` → *Import from file…* (o abre el `.json`, copia todo y pégalo con Ctrl+V sobre el lienzo). Repite con `error-workflow.json`.

**7. Asignar credenciales.** En `Pedido a Zoho` abre el nodo **Registrar log** y elige `Postgres tienda`; abre **Enviar correo** y elige `SMTP Mailpit`. Haz lo mismo en el nodo de correo del Error Workflow. Guarda.

**8. Asignar el Error Workflow.** En `Pedido a Zoho`: menú `⋯` → *Settings* → **Error Workflow (to notify when this one errors)** → elige `Aviso de error por correo`.

**9. Publicar los dos flujos** con el botón **Publish**. Sin publicar, el webhook de producción no responde y el Error Workflow no se ejecuta (n8n lo ignora y deja un aviso en sus logs).

## Probarlo

1. Entra al front (http://localhost:5173), inicia sesión y crea un pedido.
2. En n8n → **Executions** debe aparecer una ejecución exitosa de `Pedido a Zoho`.
3. Mira la tabla de logs en Adminer (http://localhost:8080, sistema *PostgreSQL*, servidor `postgres`, usuario `postgres`, base `tienda`):

   ```sql
   SELECT * FROM log_integraciones ORDER BY id DESC;
   ```
4. Abre Mailpit en http://localhost:8025: debe haber un correo `[OK] Pedido #N -> Zoho: creado`. Crea otro pedido del mismo cliente y el correo dirá `actualizado`.
5. Revisa en Zoho CRM → Contactos que el contacto exista.

Para probar el manejo de errores, apaga Postgres un momento (`docker compose stop postgres`), dispara un pedido por el webhook y revisa Mailpit: llega `[n8n] Falló el flujo: Pedido a Zoho`. Después `docker compose start postgres`.

## Qué hace cada paso de `pedido-a-zoho`

| Nodo | Qué hace |
|---|---|
| Webhook pedido | Recibe el `POST /webhook/pedido` que manda la API |
| Validar | Comprueba el secreto de la cabecera `X-Webhook-Secret`, que el pedido tenga id y que el cliente tenga nombre y correo válidos |
| ¿Datos válidos? | Si no son válidos va a **Rechazado**, que registra `rechazado` en el log y no llama a Zoho. Si el secreto es incorrecto no se escribe nada, para que nadie ajeno llene el log ni el buzón |
| Obtener token Zoho | Cambia el refresh token por un access token (dura 1 hora) |
| Buscar contacto por correo | `GET /Contacts/search?email=` (Zoho responde 204 si no existe) |
| Decidir / ¿Existe en Zoho? | Si encontró un contacto, lo actualiza; si no, lo crea |
| Actualizar contacto / Crear contacto | `PUT` o `POST` en `/Contacts` |
| Resultado Zoho | Revisa que Zoho responda `SUCCESS` en el cuerpo, no solo HTTP 200 |
| Error Zoho | Recibe cualquier llamada a Zoho que siga fallando después de 3 intentos y arma el registro de error |
| Registrar log | `INSERT` en `log_integraciones` |
| Enviar correo | Notifica `[OK]`, `[ERROR]` o `[RECHAZADO]` con el detalle |

## Buenas prácticas aplicadas

- **Idempotencia:** el flujo busca en Zoho antes de crear (no duplica contactos) y la tabla tiene un índice único para los resultados `ok` de cada pedido, así que repetir un pedido ya sincronizado no duplica el log ni vuelve a mandar correo.
- **Reintentos:** las 4 llamadas a Zoho reintentan 3 veces con 2 segundos de espera.
- **Logs:** cada intento queda en `log_integraciones` (ok, error o rechazado) y en las ejecuciones de n8n.
- **Credenciales fuera del flujo:** los JSON no contienen secretos. Zoho se lee de variables de entorno (`$env`), Postgres y SMTP viven en credenciales cifradas de n8n y el webhook exige un secreto compartido.
- **La API no depende de n8n:** si n8n está apagado o tarda más de 3 segundos, el pedido igual se guarda y solo queda un aviso en el log de la API (`api/integraciones.js`).

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| `docker compose up` dice "Falta N8N_ENCRYPTION_KEY" o "Falta PEDIDOS_WEBHOOK_SECRET" | No agregaste esas líneas a `proyecto/.env` (paso 1) |
| El pedido se crea pero n8n no registra ejecución | El flujo no está publicado, o el secreto de `proyecto/.env` no coincide (en ese caso n8n lo ignora sin dejar rastro). Revisa el log de la API: `docker compose logs api` |
| El nodo de Zoho falla con 401 o `invalid_code` | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` o `ZOHO_REFRESH_TOKEN` incorrectos, o centro de datos distinto de `.com` (define `ZOHO_ACCOUNTS_URL` y `ZOHO_API_DOMAIN`) |
| Cambiaste algo en `.env` y n8n no lo ve | Las variables se leen al crear el contenedor: `docker compose up -d` otra vez |
| Perdiste las credenciales de n8n | Cambió `N8N_ENCRYPTION_KEY`: con otra clave n8n no puede leer las guardadas |

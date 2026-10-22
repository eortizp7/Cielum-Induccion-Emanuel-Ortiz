# RPA con Playwright (parte 7)

Dos bots en Python:

| Archivo | Qué hace |
|---|---|
| `practica_formulario.py` | Ejercicio intermedio: entra a un formulario de pruebas público, lo llena, lo envía y toma capturas. |
| `reporte_pedidos.py` | Reto del día: entra al frontend de la tienda como una persona, lee la lista de pedidos del día y genera `reporte_diario.xlsx`. |

## Cómo correrlos (PowerShell)

Desde la carpeta `proyecto/rpa`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m playwright install chromium
```

Bot del formulario (no necesita nada más):

```powershell
python practica_formulario.py
```

Bot del reporte (el proyecto tiene que estar levantado con `docker compose up -d` en `proyecto/`):

```powershell
$env:RPA_USUARIO = "admin"          # el ADMIN_USUARIO de tu api/.env
$env:RPA_CLAVE   = "tu_clave"       # el ADMIN_CLAVE de tu api/.env
python reporte_pedidos.py
```

Variables opcionales: `FRONT_URL` (por defecto `http://localhost:5173`), `HEADLESS=1` (sin ventana), `TODOS=1` (todos los pedidos, no solo los de hoy).

Resultado: `reporte_diario.xlsx` (hoja **Pedidos** con total y hoja **Resumen por estado**) y capturas en `capturas/`.

## Cómo funciona `reporte_pedidos.py`

1. Abre `/login`, escribe usuario y clave y pulsa **Entrar**, igual que una persona.
2. En el listado pone 50 pedidos por página y recorre las páginas con el botón **Siguiente** hasta que queda deshabilitado.
3. Lee cada fila de la tabla (número, cliente, fecha, estado, total) y convierte el total (`$ 45.000`) en número.
4. Se queda con los pedidos cuya fecha es la de hoy y escribe el Excel.

### Decisiones para que no sea frágil
- **Selectores por etiqueta, rol o id** (`Usuario`, `Clave`, botón `Entrar`, `#filtro-limite`), no por posición ni por clases de estilo.
- **Esperas explícitas, sin `sleep`:** el bot espera a que la tabla deje de estar ocupada (`aria-busy="false"`) y a que el indicador "Página X de Y" cambie antes de leer. Sin esto leía la tabla vacía mientras cargaba.
- **Captura en error:** si algo falla guarda `capturas/error_reporte.png` y termina con código de salida 1.
- **Credenciales por variables de entorno:** nunca van escritas en el código ni en el repositorio.
- **Misma zona horaria e idioma que el frontend** (`America/Bogota`, `es-CO`): así "hoy" significa lo mismo para el bot y para quien mira la pantalla.

## ¿Por qué en la vida real esto se haría mejor por API?

La tienda **ya tiene** `GET /pedidos` con paginación, así que este bot es un camino largo para llegar a datos que se pueden pedir directo:

- **Estabilidad:** el bot depende de textos y de la estructura de la pantalla. Si alguien cambia "Siguiente" por "Next", renombra un id o rediseña la tabla, el bot se rompe. Un contrato de API cambia con aviso y versión.
- **Datos crudos:** la API entrega la fecha en formato ISO y el total como número. El bot tiene que leer texto formateado (`21/10/2026, 7:13 a. m.`, `$ 45.000`) y volver a interpretarlo, y ese formato depende del idioma del navegador.
- **Velocidad y recursos:** una petición HTTP tarda milisegundos; abrir un navegador, iniciar sesión y paginar tarda segundos y consume mucha más memoria.
- **Filtros y errores:** en la API se filtra en el servidor y los errores llegan con código HTTP claro. En la pantalla hay que adivinar qué falló.
- **Mantenimiento y pruebas:** un cliente de API es más corto y se prueba con Postman o Newman.

## ¿Cuándo sí se justifica el RPA?

- El sistema **no tiene API** o no se puede usar (software heredado, programas de escritorio, portales de terceros).
- **No se puede modificar** la aplicación ni pedir que alguien construya la integración.
- El proceso **cruza varias aplicaciones** con pantallas (copiar de una a otra) y ninguna ofrece integración.
- Como **solución puente** mientras llega la integración por API.
- Para **pruebas de extremo a extremo** de la propia interfaz.

Regla práctica: si existe una API estable, se usa la API; el RPA es el plan B cuando solo existe la pantalla.

## Limitaciones de este bot
- "Hoy" se decide comparando el texto de la fecha que muestra el frontend. Si el formato de fecha de la pantalla cambia, hay que ajustarlo.
- Lee solo lo que muestra la tabla (no incluye el detalle de los productos de cada pedido).

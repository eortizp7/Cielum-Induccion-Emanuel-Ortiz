# Bitácora Día 13 · \[Zoho CRM: configuración y API]

**Fecha: 19 de Octubre**
**Horas invertidas:** autoinvestigación 3 h · práctica 2 h · reto 2 h

## Autoinvestigación básica

1. Pregunta: ¿Qué es un CRM y para qué lo usa una empresa?
Respuesta: Es un sistema para guardar y seguir la relación con clientes y posibles clientes: datos de contacto, historial, tareas y oportunidades de venta. La empresa lo usa para no perder leads y saber en qué etapa va cada negocio.
2. Pregunta: Módulos estándar: Leads, Contacts, Accounts, Deals. Conversión de Lead.
Respuesta: Lead es un posible cliente sin calificar. Contact es una persona ya calificada. Account es la empresa. Deal es una oportunidad de venta con monto y etapa. Al convertir un lead, Zoho crea el Contact y el Account, y opcionalmente un Deal.
3. Pregunta: Campos personalizados, layouts, vistas y listas.
Respuesta: Los campos personalizados agregan datos propios al módulo. El layout decide qué campos se ven y en qué orden. Las vistas son filtros guardados sobre la lista de registros.
4. Pregunta: Roles, perfiles y permisos.
Respuesta: El perfil define qué se puede hacer (ver, crear, editar, borrar por módulo). El rol define la jerarquía: qué registros de otros usuarios se pueden ver.
5. Pregunta: Importación de datos y reportes/dashboards.
Respuesta: Se importa un CSV mapeando columnas a campos. Los reportes resumen datos con filtros y los dashboards muestran varios reportes en gráficos.

## Autoinvestigación avanzada

1. Workflow rules, asignación automática y blueprints.
Un workflow ejecuta acciones automáticas (tarea, correo, actualización de campo) cuando se cumple una condición. La asignación automática reparte registros entre usuarios con reglas. El blueprint obliga a seguir un proceso por etapas, con transiciones definidas.
2. Deluge: qué es y para qué se usa.
Es el lenguaje de scripts de Zoho. Se usa en funciones personalizadas para hacer lo que un workflow simple no alcanza: leer y actualizar registros, llamar otras APIs, calcular valores.
3. API REST: OAuth 2.0 con Self Client, access token vs refresh token, scopes, data center.
El Self Client genera un código (grant token) de un solo uso que se cambia por un access token (dura 1 hora) y un refresh token (no vence). Con el refresh token se piden access tokens nuevos. Los scopes limitan qué módulos se pueden tocar. El dominio cambia según el centro de datos (`.com`, `.eu`, `.in`...).
4. CRUD de registros por API, búsqueda y COQL.
Se crea con POST, se consulta con GET, se actualiza con PUT y se borra con DELETE sobre `/crm/{versión}/{Módulo}`. Se busca con `/search` por email, teléfono o criterio. COQL permite consultar con sintaxis parecida a SQL.
5. Webhooks y límites de API.
Un webhook avisa a otro sistema por HTTP cuando pasa algo en el CRM. La API tiene límites de créditos y peticiones por día según el plan.

## Ejercicios

### Básico: cuenta de prueba y 10 leads
Creé la cuenta de prueba de Zoho CRM y cargué 10 leads ficticios: 5 a mano y 5 importando el CSV `proyecto/zoho/leads.csv`.

![Lista de leads](../proyecto/zoho/capturas/01-leads.png)

### Intermedio
**Campo personalizado "Origen Cielum"** (lista: Web, Referido, Evento), agregado al layout de Leads.

![Campo Origen Cielum](../proyecto/zoho/capturas/02-campo-origen.png)

**Vista filtrada "Leads Web"** (Origen Cielum = Web).

![Vista filtrada](../proyecto/zoho/capturas/03-vista.png)

**Workflow:** módulo Leads, al crear un registro, condición Origen Cielum = Web, acción: tarea "Contactar lead web" asignada al dueño del lead.

![Workflow](../proyecto/zoho/capturas/04-workflow.png)

![Tarea creada por el workflow](../proyecto/zoho/capturas/05-tarea.png)

### Avanzado: API con Postman
Creé un Self Client en api-console.zoho.com, cambié el grant code por los tokens y armé la colección `proyecto/zoho/zoho-crm.postman_collection.json` (sin tokens reales, todo en variables). Un script *pre-request* renueva el access token con el refresh token cuando vence.

Peticiones: 0 obtener tokens, 1 crear lead, 2 consultar por id, 3 listar, 4 actualizar, 5 buscar por email, 6 buscar por criterio. Todos los tests pasan.

![Postman con las peticiones](../proyecto/zoho/capturas/06-postman.png)

### Función Deluge
Cuando se crea un Deal, copia su nombre en la descripción del Contact asociado. **Quedó documentada pero no ejecutada:** la edición gratuita no permite funciones personalizadas (solo correo y tarea como acciones instantáneas).

![Acciones instantáneas disponibles: solo correo y tarea](../proyecto/zoho/capturas/07-sin-funciones.png)

```deluge
// Argumento: dealId (ID del Deal)
deal = zoho.crm.getRecordById("Deals", dealId);
contacto = deal.get("Contact_Name");
if(contacto != null)
{
    contactoId = contacto.get("id");
    cambios = Map();
    cambios.put("Description", "Último deal: " + deal.get("Deal_Name"));
    respuesta = zoho.crm.updateRecord("Contacts", contactoId, cambios);
    info respuesta;
}
return "";
```

Evidencia completa en `proyecto/zoho/configuracion.md`.

## Lo que aprendí hoy

## Lo que no entendí o me costó

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|
| Postman mostró "Secrets Detected" al guardar | Detecta variables que parecen credenciales | Elegí Override; en la colección las variables van vacías |
| No encontraba "Funciones" en Zoho | La edición gratuita no incluye funciones personalizadas (Deluge) | Documenté la función y dejé captura como evidencia |
| Capturas con nombre `.png` | Windows agregó la extensión al guardar | `Rename-Item` en PowerShell para quitar la extensión repetida |

## Uso de IA hoy
Sí, la usé para armar la colección de Postman, el esqueleto de la documentación y revisar conceptos de la API.

## Autoevaluación del tema (1-5): 4

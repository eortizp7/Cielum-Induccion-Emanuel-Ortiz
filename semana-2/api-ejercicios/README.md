# Ejercicios día 7: Node.js + Express

| Archivo | Ejercicio | Puerto |
|---|---|---|
| `01_basico_salud.js` | Básico: `GET /salud` responde `{ estado: "ok", fecha }` | 4000 |
| `02_intermedio_crud_memoria.js` | Intermedio: CRUD de productos en memoria | 4001 |
| `03_avanzado_pg_zod.js` | Avanzado: CRUD de productos en PostgreSQL con `pg`, validación con zod y middleware de errores | 4002 |

Los puertos son distintos a los del proyecto (3000 y 3001) para que puedan correr al mismo tiempo.

## Cómo correrlos (PowerShell)

```powershell
cd semana-2\api-ejercicios
npm install
npm run basico        # o: npm run intermedio / npm run avanzado
```

El avanzado necesita el Postgres del proyecto encendido y un `.env`:

```powershell
cd ..\..\proyecto
docker compose up -d postgres
cd ..\semana-2\api-ejercicios
Copy-Item .env.example .env      # y pon en DB_PASSWORD la misma clave del proyecto
npm run avanzado
```

## Pruebas rápidas

```powershell
curl.exe http://localhost:4000/salud
curl.exe http://localhost:4001/productos
curl.exe -X POST http://localhost:4002/productos -H "Content-Type: application/json" -d "{\"nombre\":\"Nivel\",\"precio\":30000,\"sku\":\"HER-001\"}"
curl.exe -X POST http://localhost:4002/productos -H "Content-Type: application/json" -d "{\"nombre\":\"\",\"precio\":-5}"
```

La última responde 400 con el detalle de cada campo que falló:

```json
{ "error": "Datos inválidos", "detalles": [
  { "campo": "nombre", "mensaje": "El nombre es obligatorio" },
  { "campo": "precio", "mensaje": "El precio debe ser mayor o igual a 0" },
  { "campo": "sku",    "mensaje": "El sku es obligatorio" } ] }
```

// La URL de la API se fija al compilar (VITE_API_URL). Con Docker Compose la API sale por el 3001.
const URL_API = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

// Error con el código HTTP, para que las pantallas decidan qué hacer (ej: 401 => volver al login)
export class ErrorApi extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

function mensajePorEstado(status) {
  if (status === 400) return 'Los datos enviados no son válidos.';
  if (status === 401) return 'Tu sesión no es válida. Inicia sesión de nuevo.';
  if (status === 404) return 'No se encontró lo que buscabas.';
  if (status === 409) return 'La operación choca con el estado actual de los datos.';
  return 'Ocurrió un error en el servidor. Intenta de nuevo en un momento.';
}

// Hace la petición y devuelve el JSON. Si algo falla, lanza un ErrorApi con un mensaje legible.
export async function llamarApi(ruta, { metodo = 'GET', cuerpo, token, signal } = {}) {
  const cabeceras = {};
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json';
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err; // la pantalla se cerró: no es un error para mostrar
    // fetch solo falla así cuando no hay conexión o cuando el navegador bloquea por CORS
    throw new ErrorApi(
      0,
      'No se pudo conectar con la API. Revisa que esté encendida y que su CORS_ORIGENES incluya esta dirección.',
    );
  }

  if (respuesta.status === 204) return null;

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    // la respuesta no trae JSON: usamos el mensaje por defecto
  }

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, datos?.error || mensajePorEstado(respuesta.status));
  }
  return datos;
}

import { ErrorApi, llamarApi } from '../api/cliente.js';
import { useAuthStore } from '../stores/auth.js';

// Composable (el equivalente a un custom hook): devuelve una función para llamar a la API con el token puesto.
// Si la API responde 401 (token vencido o inválido), cierra la sesión; el layout lo nota y manda al login.
export function useApi() {
  const auth = useAuthStore();

  return async function api(ruta, opciones = {}) {
    try {
      return await llamarApi(ruta, { ...opciones, token: auth.token });
    } catch (err) {
      if (err instanceof ErrorApi && err.status === 401) {
        auth.salir('Tu sesión expiró. Inicia sesión de nuevo.');
      }
      throw err;
    }
  };
}

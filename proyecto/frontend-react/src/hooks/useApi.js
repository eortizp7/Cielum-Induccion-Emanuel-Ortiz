import { useCallback } from 'react';
import { ErrorApi, llamarApi } from '../api/cliente.js';
import { useAuth } from '../auth/useAuth.js';

// Devuelve una función para llamar a la API ya con el token puesto.
// Si la API responde 401 (token vencido o inválido), cierra la sesión y manda al login.
export function useApi() {
  const { token, salir } = useAuth();

  return useCallback(
    async (ruta, opciones = {}) => {
      try {
        return await llamarApi(ruta, { ...opciones, token });
      } catch (err) {
        if (err instanceof ErrorApi && err.status === 401) {
          salir('Tu sesión expiró. Inicia sesión de nuevo.');
        }
        throw err;
      }
    },
    [token, salir],
  );
}

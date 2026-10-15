import { useCallback, useMemo, useState } from 'react';
import { llamarApi } from '../api/cliente.js';
import { AuthContext } from './AuthContext.js';

const CLAVE_TOKEN = 'token';

// localStorage puede no estar disponible (modo privado, permisos): nunca debe romper la app
function leerGuardado() {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}
function guardar(token) {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
  } catch {
    // sin almacenamiento: la sesión dura mientras la pestaña esté abierta
  }
}
function olvidar() {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    // nada que borrar
  }
}

// El payload del JWT es Base64 legible (no está cifrado): de ahí sacamos usuario y vencimiento.
function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function tokenVigente(token) {
  const payload = token && leerPayload(token);
  return payload && payload.exp * 1000 > Date.now() ? token : null;
}

export function AuthProvider({ children }) {
  // Función en useState: se ejecuta una sola vez, al montar
  const [token, setToken] = useState(() => tokenVigente(leerGuardado()));
  const [aviso, setAviso] = useState('');

  const entrar = useCallback(async (usuario, clave) => {
    const respuesta = await llamarApi('/auth/login', { metodo: 'POST', cuerpo: { usuario, clave } });
    guardar(respuesta.token);
    setAviso('');
    setToken(respuesta.token);
  }, []);

  const salir = useCallback((motivo = '') => {
    olvidar();
    setAviso(motivo);
    setToken(null);
  }, []);

  const valor = useMemo(
    () => ({
      token,
      usuario: token ? leerPayload(token)?.usuario : null,
      autenticado: Boolean(token),
      aviso,
      entrar,
      salir,
    }),
    [token, aviso, entrar, salir],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { llamarApi } from '../api/cliente.js';

// Store de Pinia con la sesión: el equivalente al AuthProvider + Context de React.
// Cualquier componente lo usa con useAuthStore(), sin pasar props.

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
export function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function tokenVigente(token) {
  const payload = token && leerPayload(token);
  return payload && payload.exp * 1000 > Date.now() ? token : null;
}

export const useAuthStore = defineStore('auth', () => {
  // ref: valores reactivos. Al cambiar, Vue actualiza solo lo que los usa.
  const token = ref(tokenVigente(leerGuardado()));
  const aviso = ref('');

  // computed: se recalculan solos cuando cambia el token
  const usuario = computed(() => (token.value ? leerPayload(token.value)?.usuario : null));
  const autenticado = computed(() => Boolean(token.value));

  async function entrar(nombreUsuario, clave) {
    const respuesta = await llamarApi('/auth/login', {
      metodo: 'POST',
      cuerpo: { usuario: nombreUsuario, clave },
    });
    guardar(respuesta.token);
    aviso.value = '';
    token.value = respuesta.token;
  }

  function salir(motivo = '') {
    olvidar();
    aviso.value = motivo;
    token.value = null;
  }

  // Si el token venció mientras la app estaba abierta, se cierra la sesión con aviso
  function revisarVencimiento() {
    if (token.value && !tokenVigente(token.value)) {
      salir('Tu sesión expiró. Inicia sesión de nuevo.');
    }
  }

  return { token, aviso, usuario, autenticado, entrar, salir, revisarVencimiento };
});

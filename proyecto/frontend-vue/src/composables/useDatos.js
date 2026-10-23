import { onUnmounted, ref, toValue, watch } from 'vue';
import { useApi } from './useApi.js';

// Carga una ruta (GET) y devuelve { datos, cargando, error, recargar }.
// "ruta" puede ser un texto o una función que devuelve el texto: si cambia (otro filtro, otra página),
// el watch vuelve a cargar solo. Es el equivalente del useDatos de React (useEffect + dependencias).
export function useDatos(ruta) {
  const api = useApi();
  const datos = ref(null);
  const error = ref(null);
  const cargando = ref(true);
  let control = null;

  async function cargar() {
    control?.abort(); // si había una petición en vuelo (filtro anterior), se cancela
    const propio = new AbortController();
    control = propio;
    cargando.value = true;
    error.value = null;
    try {
      // Mientras llega la respuesta nueva se siguen mostrando los datos anteriores (sin parpadeo)
      datos.value = await api(toValue(ruta), { signal: propio.signal });
    } catch (err) {
      if (err.name === 'AbortError') return;
      error.value = err.message;
    } finally {
      if (control === propio) cargando.value = false;
    }
  }

  watch(() => toValue(ruta), cargar, { immediate: true });
  onUnmounted(() => control?.abort()); // limpieza: la pantalla se cerró

  return { datos, cargando, error, recargar: cargar };
}

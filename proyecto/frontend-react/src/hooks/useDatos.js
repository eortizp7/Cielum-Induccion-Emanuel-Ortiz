import { useCallback, useEffect, useState } from 'react';
import { useApi } from './useApi.js';

// Carga una ruta (GET) y devuelve { datos, cargando, error, recargar }.
// Se vuelve a ejecutar cuando cambia la ruta (por ejemplo, otra página) o al llamar recargar().
export function useDatos(ruta) {
  const api = useApi();
  const [version, setVersion] = useState(0);

  // Identifica "esta petición". "cargando" es simplemente: todavía no llegó la respuesta de esta clave.
  const clave = `${ruta}#${version}`;
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });

  useEffect(() => {
    // AbortController: si la ruta cambia o la pantalla se cierra, se cancela la petición en vuelo
    const control = new AbortController();

    api(ruta, { signal: control.signal })
      .then((datos) => setResultado({ clave, datos, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResultado({ clave, datos: null, error: err.message });
      });

    return () => control.abort(); // limpieza del efecto
  }, [api, ruta, clave]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  const cargando = resultado.clave !== clave;
  // Mientras llega la respuesta nueva se siguen mostrando los datos anteriores (sin parpadeo)
  return { datos: resultado.datos, cargando, error: cargando ? null : resultado.error, recargar };
}

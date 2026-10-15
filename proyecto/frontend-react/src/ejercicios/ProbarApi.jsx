import { useState } from 'react';
import { llamarApi } from '../api/cliente.js';
import { useAuth } from '../auth/useAuth.js';
import { useApi } from '../hooks/useApi.js';

// Ejercicio 3: useApi (token + 401) y ruta protegida.
// Esta pantalla ya está dentro de <RutaProtegida>: sin sesión nunca se llega aquí.
export default function ProbarApi() {
  const { usuario, token } = useAuth();
  const api = useApi(); // llama a la API con el token ya puesto
  const [resultado, setResultado] = useState(null);

  async function conToken() {
    try {
      const datos = await api('/pedidos?limite=1');
      setResultado({ tipo: 'ok', texto: `200: la API aceptó tu token (hay ${datos.total_registros} pedidos en total).` });
    } catch (err) {
      setResultado({ tipo: 'error', texto: `${err.status}: ${err.message}` });
    }
  }

  async function sinToken() {
    try {
      // llamarApi directo, sin useApi: no se manda token
      await llamarApi('/pedidos?limite=1');
      setResultado({ tipo: 'ok', texto: '200: la API respondió sin token (esto no debería pasar).' });
    } catch (err) {
      setResultado({ tipo: 'error', texto: `${err.status}: ${err.message}` });
    }
  }

  return (
    <div>
      <dl className="datos">
        <div>
          <dt>Sesión de</dt>
          <dd>{usuario}</dd>
        </div>
        <div>
          <dt>Token guardado</dt>
          <dd>{token ? `${token.slice(0, 14)}…` : 'ninguno'}</dd>
        </div>
      </dl>

      <div className="acciones ejercicio__fila">
        <button type="button" className="boton boton--primario" onClick={conToken}>
          Llamar a /pedidos con token
        </button>
        <button type="button" className="boton" onClick={sinToken}>
          Llamar a /pedidos sin token
        </button>
      </div>

      {resultado && (
        <p className={resultado.tipo === 'ok' ? 'aviso aviso--ok' : 'aviso aviso--error'} role="status">
          {resultado.texto}
        </p>
      )}

      <p className="ayuda">
        La ruta protegida está en <code>components/RutaProtegida.jsx</code> y el hook en <code>hooks/useApi.js</code>. Quien
        decide si el token sirve es la API, no esta pantalla.
      </p>
    </div>
  );
}

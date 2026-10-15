import { Link, useSearchParams } from 'react-router-dom';
import Aviso from '../components/Aviso.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import Paginacion from '../components/Paginacion.jsx';
import { useDatos } from '../hooks/useDatos.js';
import { ESTADOS, etiquetaEstado, fecha, moneda } from '../utils/formato.js';

const LIMITES = [5, 10, 20, 50];

function enteroPositivo(valor, porDefecto) {
  const n = Number(valor);
  return Number.isInteger(n) && n >= 1 ? n : porDefecto;
}

export default function Pedidos() {
  // Los filtros viven en la URL (?estado=pagado&pagina=2): se pueden recargar, compartir y volver atrás
  const [params, setParams] = useSearchParams();
  const estado = ESTADOS.includes(params.get('estado')) ? params.get('estado') : '';
  const pagina = enteroPositivo(params.get('pagina'), 1);
  const limiteUrl = enteroPositivo(params.get('limite'), 10);
  const limite = LIMITES.includes(limiteUrl) ? limiteUrl : 10;

  const consulta = new URLSearchParams({ pagina, limite });
  if (estado) consulta.set('estado', estado);
  const { datos, cargando, error, recargar } = useDatos(`/pedidos?${consulta}`);

  function cambiar(cambios) {
    const siguiente = new URLSearchParams(params);
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === '') siguiente.delete(clave);
      else siguiente.set(clave, valor);
    }
    setParams(siguiente);
  }

  const pedidos = datos?.datos ?? [];
  const hayDatos = datos !== null;

  return (
    <section>
      <div className="encabezado">
        <h1>Pedidos</h1>
        <Link to="/pedidos/nuevo" className="boton boton--primario">
          Nuevo pedido
        </Link>
      </div>

      <div className="filtros">
        <div>
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={estado}
            onChange={(e) => cambiar({ estado: e.target.value, pagina: '' })}
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {etiquetaEstado(e)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filtro-limite">Por página</label>
          <select
            id="filtro-limite"
            value={limite}
            onChange={(e) => cambiar({ limite: e.target.value, pagina: '' })}
          >
            {LIMITES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Aviso
          tipo="error"
          accion={
            <button type="button" className="boton" onClick={recargar}>
              Reintentar
            </button>
          }
        >
          {error}
        </Aviso>
      )}

      {cargando && !hayDatos && <p className="vacio">Cargando pedidos…</p>}

      {hayDatos && pedidos.length === 0 && (
        <div className="vacio">
          {datos.total_registros > 0 ? (
            <>
              <p>Esta página no tiene pedidos.</p>
              <button type="button" className="boton" onClick={() => cambiar({ pagina: '' })}>
                Volver a la primera página
              </button>
            </>
          ) : estado ? (
            <p>No hay pedidos con estado «{estado}». Prueba con otro estado o quita el filtro.</p>
          ) : (
            <p>
              Todavía no hay pedidos. <Link to="/pedidos/nuevo">Crea el primero</Link>.
            </p>
          )}
        </div>
      )}

      {pedidos.length > 0 && (
        <div className="tabla-contenedor" aria-busy={cargando}>
          <table>
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Cliente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col" className="numero">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/pedidos/${p.id}`}>#{p.id}</Link>
                  </td>
                  <td>{p.cliente}</td>
                  <td>{fecha(p.fecha_pedido)}</td>
                  <td>
                    <EstadoBadge estado={p.estado} />
                  </td>
                  <td className="numero">{moneda(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hayDatos && datos.total_registros > 0 && (
        <Paginacion
          pagina={datos.pagina}
          paginas={datos.paginas}
          total={datos.total_registros}
          onCambiar={(n) => cambiar({ pagina: n === 1 ? '' : String(n) })}
        />
      )}
    </section>
  );
}

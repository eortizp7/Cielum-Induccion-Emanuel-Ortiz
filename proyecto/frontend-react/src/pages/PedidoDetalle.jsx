import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Aviso from '../components/Aviso.jsx';
import FlujoEstado from '../components/FlujoEstado.jsx';
import { useApi } from '../hooks/useApi.js';
import { useDatos } from '../hooks/useDatos.js';
import { ESTADOS, etiquetaEstado, fecha, moneda } from '../utils/formato.js';

export default function PedidoDetalle() {
  const { id } = useParams();
  const ubicacion = useLocation();
  const api = useApi();
  const { datos: pedido, cargando, error, recargar } = useDatos(`/pedidos/${id}`);

  // elegido es null mientras la persona no toque el selector: en ese caso se muestra el estado real
  const [elegido, setElegido] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState(
    ubicacion.state?.creado ? { tipo: 'ok', texto: 'Pedido creado. El stock ya se descontó.' } : null,
  );

  async function guardarEstado() {
    setGuardando(true);
    setResultado(null);
    try {
      await api(`/pedidos/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado: elegido } });
      setResultado({ tipo: 'ok', texto: `Estado actualizado a «${etiquetaEstado(elegido)}».` });
      setElegido(null);
      recargar();
    } catch (err) {
      setResultado({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  }

  if (error) {
    return (
      <section>
        <h1>Pedido <span className="num-h1">#{id}</span></h1>
        <Aviso tipo="error">{error}</Aviso>
        <p>
          <Link to="/pedidos">Volver al listado</Link>
        </p>
      </section>
    );
  }
  if (!pedido) {
    return (
      <section>
        <h1>Pedido <span className="num-h1">#{id}</span></h1>
        <p className="vacio">{cargando ? 'Cargando pedido…' : ''}</p>
      </section>
    );
  }

  const seleccionado = elegido ?? pedido.estado;

  return (
    <section>
      <p className="migas">
        <Link to="/pedidos">Pedidos</Link>
      </p>
      <h1>Pedido <span className="num-h1">#{pedido.id}</span></h1>

      {resultado && <Aviso tipo={resultado.tipo}>{resultado.texto}</Aviso>}

      <dl className="datos">
        <div>
          <dt>Cliente</dt>
          <dd>{pedido.cliente}</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{fecha(pedido.fecha_pedido)}</dd>
        </div>
        <div>
          <dt>Notas</dt>
          <dd>{pedido.notas || 'Sin notas'}</dd>
        </div>
      </dl>

      <FlujoEstado estado={pedido.estado} />

      <div className="editor-estado">
        <label htmlFor="estado">Cambiar estado</label>
        <select id="estado" value={seleccionado} onChange={(e) => setElegido(e.target.value)}>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {etiquetaEstado(e)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="boton boton--primario"
          onClick={guardarEstado}
          disabled={guardando || seleccionado === pedido.estado}
        >
          {guardando ? 'Guardando…' : 'Guardar estado'}
        </button>
      </div>
      {seleccionado === 'cancelado' && seleccionado !== pedido.estado && (
        <Aviso tipo="info">Cancelar un pedido no devuelve las unidades al stock.</Aviso>
      )}

      <h2>Productos</h2>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col" className="numero">
                Cantidad
              </th>
              <th scope="col" className="numero">
                Precio unitario
              </th>
              <th scope="col" className="numero">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map((item) => (
              <tr key={item.producto_id}>
                <td>{item.producto}</td>
                <td className="numero">{item.cantidad}</td>
                <td className="numero">{moneda(item.precio_unitario)}</td>
                <td className="numero">{moneda(item.cantidad * item.precio_unitario)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <td className="numero">{moneda(pedido.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

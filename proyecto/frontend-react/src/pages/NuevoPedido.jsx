import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Aviso from '../components/Aviso.jsx';
import { useApi } from '../hooks/useApi.js';
import { useDatos } from '../hooks/useDatos.js';
import { moneda } from '../utils/formato.js';

export default function NuevoPedido() {
  const api = useApi();
  const navegar = useNavigate();
  const clientes = useDatos('/clientes');
  const productos = useDatos('/productos');

  // Estado del formulario. Cada línea lleva un id propio: sirve como "key" al pintar la lista.
  const siguienteId = useRef(1);
  const [clienteId, setClienteId] = useState('');
  const [notas, setNotas] = useState('');
  const [lineas, setLineas] = useState([{ id: 0, productoId: '', cantidad: '1' }]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const catalogo = productos.datos ?? [];
  const productoPorId = new Map(catalogo.map((p) => [String(p.id), p]));

  function cambiarLinea(id, cambios) {
    setLineas((actuales) => actuales.map((l) => (l.id === id ? { ...l, ...cambios } : l)));
  }
  function agregarLinea() {
    const id = siguienteId.current++;
    setLineas((actuales) => [...actuales, { id, productoId: '', cantidad: '1' }]);
  }
  function quitarLinea(id) {
    setLineas((actuales) => actuales.filter((l) => l.id !== id));
  }

  // Lo que se calcula a partir del estado no se guarda en otro estado: se deriva en cada render
  const total = lineas.reduce((suma, l) => {
    const producto = productoPorId.get(l.productoId);
    const cantidad = Number(l.cantidad);
    return producto && Number.isInteger(cantidad) && cantidad > 0 ? suma + producto.precio * cantidad : suma;
  }, 0);

  function problemaEnFormulario() {
    if (clienteId === '') return 'Elige un cliente.';
    for (const l of lineas) {
      const producto = productoPorId.get(l.productoId);
      if (!producto) return 'Elige un producto en cada línea, o quita las líneas que no uses.';
      const cantidad = Number(l.cantidad);
      if (!Number.isInteger(cantidad) || cantidad < 1) return 'La cantidad debe ser un número entero mayor a 0.';
      if (cantidad > producto.stock) {
        return `De «${producto.nombre}» solo quedan ${producto.stock} unidades.`;
      }
    }
    return '';
  }

  async function enviar(evento) {
    evento.preventDefault();
    const problema = problemaEnFormulario();
    if (problema) {
      setError(problema);
      return;
    }

    setEnviando(true);
    setError('');
    try {
      const creado = await api('/pedidos', {
        metodo: 'POST',
        cuerpo: {
          cliente_id: Number(clienteId),
          notas: notas.trim() || undefined, // si va vacío, ni se envía
          items: lineas.map((l) => ({ producto_id: Number(l.productoId), cantidad: Number(l.cantidad) })),
        },
      });
      navegar(`/pedidos/${creado.id}`, { state: { creado: true } });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
      productos.recargar(); // el stock pudo cambiar: mostramos las cifras al día
    }
  }

  const cargandoListas = (clientes.cargando && !clientes.datos) || (productos.cargando && !productos.datos);
  const errorListas = clientes.error || productos.error;

  if (errorListas) {
    return (
      <section>
        <h1>Nuevo pedido</h1>
        <Aviso
          tipo="error"
          accion={
            <button
              type="button"
              className="boton"
              onClick={() => {
                clientes.recargar();
                productos.recargar();
              }}
            >
              Reintentar
            </button>
          }
        >
          {errorListas}
        </Aviso>
      </section>
    );
  }
  if (cargandoListas) {
    return (
      <section>
        <h1>Nuevo pedido</h1>
        <p className="vacio">Cargando clientes y productos…</p>
      </section>
    );
  }

  const idsElegidos = new Set(lineas.map((l) => l.productoId));

  return (
    <section>
      <h1>Nuevo pedido</h1>

      <form className="formulario" onSubmit={enviar} noValidate>
        {error && <Aviso tipo="error">{error}</Aviso>}

        <div className="campo">
          <label htmlFor="cliente">Cliente</label>
          <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="">Elige un cliente</option>
            {clientes.datos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="lineas">
          <legend>Productos</legend>
          {lineas.map((linea, indice) => {
            const producto = productoPorId.get(linea.productoId);
            const cantidad = Number(linea.cantidad);
            const subtotal = producto && Number.isInteger(cantidad) && cantidad > 0 ? producto.precio * cantidad : null;
            return (
              <div className="linea" key={linea.id}>
                <div className="campo">
                  <label htmlFor={`producto-${linea.id}`}>Producto {indice + 1}</label>
                  <select
                    id={`producto-${linea.id}`}
                    value={linea.productoId}
                    onChange={(e) => cambiarLinea(linea.id, { productoId: e.target.value })}
                  >
                    <option value="">Elige un producto</option>
                    {catalogo.map((p) => {
                      const sinStock = p.stock === 0;
                      const repetido = idsElegidos.has(String(p.id)) && String(p.id) !== linea.productoId;
                      return (
                        <option key={p.id} value={p.id} disabled={sinStock || repetido}>
                          {p.nombre}, {moneda(p.precio)} {sinStock ? '(sin stock)' : `(quedan ${p.stock})`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="campo campo--corto">
                  <label htmlFor={`cantidad-${linea.id}`}>Cantidad</label>
                  <input
                    id={`cantidad-${linea.id}`}
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={linea.cantidad}
                    onChange={(e) => cambiarLinea(linea.id, { cantidad: e.target.value })}
                  />
                </div>
                <p className="linea__subtotal numero">{subtotal === null ? '' : moneda(subtotal)}</p>
                <button
                  type="button"
                  className="boton boton--texto"
                  onClick={() => quitarLinea(linea.id)}
                  disabled={lineas.length === 1}
                  aria-label={`Quitar producto ${indice + 1}`}
                >
                  Quitar
                </button>
              </div>
            );
          })}
          <button
            type="button"
            className="boton"
            onClick={agregarLinea}
            disabled={lineas.length >= catalogo.length}
          >
            Agregar otro producto
          </button>
        </fieldset>

        <div className="campo">
          <label htmlFor="notas">Notas (opcional)</label>
          <input id="notas" value={notas} maxLength={255} onChange={(e) => setNotas(e.target.value)} />
        </div>

        <div className="resumen">
          <p>
            Total estimado <strong className="numero">{moneda(total)}</strong>
          </p>
          <div className="acciones">
            <Link to="/pedidos" className="boton">
              Cancelar
            </Link>
            <button type="submit" className="boton boton--primario" disabled={enviando}>
              {enviando ? 'Creando…' : 'Crear pedido'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

import { etiquetaEstado } from '../utils/formato.js';

// El camino normal de un pedido. "cancelado" no es un paso: es una salida del camino.
const PASOS = ['pendiente', 'pagado', 'enviado', 'entregado'];

export default function FlujoEstado({ estado }) {
  if (estado === 'cancelado') {
    return <p className="flujo-cancelado">Este pedido fue cancelado.</p>;
  }

  const actual = PASOS.indexOf(estado);
  return (
    <ol className="flujo" aria-label="Avance del pedido">
      {PASOS.map((paso, i) => (
        <li
          key={paso}
          className={i < actual ? 'hecho' : i === actual ? 'actual' : ''}
          aria-current={i === actual ? 'step' : undefined}
        >
          {etiquetaEstado(paso)}
        </li>
      ))}
    </ol>
  );
}

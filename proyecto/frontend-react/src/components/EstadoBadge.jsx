import { etiquetaEstado } from '../utils/formato.js';

export default function EstadoBadge({ estado }) {
  return <span className={`estado estado--${estado}`}>{etiquetaEstado(estado)}</span>;
}

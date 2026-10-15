// Estados válidos de un pedido, en el orden del flujo normal (los mismos que acepta la API)
export const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export function etiquetaEstado(estado) {
  return estado.charAt(0).toUpperCase() + estado.slice(1);
}

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function moneda(valor) {
  return formatoMoneda.format(valor);
}

// La API manda fechas ISO en UTC; el navegador las muestra en la hora de quien mira
export function fecha(iso) {
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}

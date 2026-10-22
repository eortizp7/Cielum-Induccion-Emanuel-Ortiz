// Avisa a n8n cuando se crea un pedido (webhook).
// Regla de oro: la integración NUNCA debe romper ni retrasar el pedido.
// Si n8n está apagado, tarda o responde error, solo queda un aviso en el log de la API.
async function notificarPedido({ pedido, cliente }) {
  const url = process.env.PEDIDOS_WEBHOOK_URL;
  if (!url) return; // integración apagada: no hay URL configurada

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // n8n compara este valor con el suyo: así nadie más puede disparar el flujo
        'X-Webhook-Secret': process.env.PEDIDOS_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({ evento: 'pedido.creado', pedido, cliente }),
      signal: AbortSignal.timeout(3000), // no esperar a n8n más de 3 segundos
    });
    if (!respuesta.ok) {
      console.error(`n8n respondió ${respuesta.status} al avisar del pedido ${pedido.id}`);
    }
  } catch (err) {
    console.error(`No se pudo avisar a n8n del pedido ${pedido.id}: ${err.message}`);
  }
}

module.exports = { notificarPedido };

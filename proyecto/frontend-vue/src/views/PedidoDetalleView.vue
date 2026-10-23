<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AvisoMensaje from '../components/AvisoMensaje.vue';
import FlujoEstado from '../components/FlujoEstado.vue';
import { useApi } from '../composables/useApi.js';
import { useDatos } from '../composables/useDatos.js';
import { ESTADOS, etiquetaEstado, fecha, moneda } from '../utils/formato.js';

const ruta = useRoute();
const api = useApi();
const id = computed(() => ruta.params.id);
const { datos: pedido, cargando, error, recargar } = useDatos(() => `/pedidos/${id.value}`);

// elegido es null mientras la persona no toque el selector: en ese caso se muestra el estado real
const elegido = ref(null);
const guardando = ref(false);
// Si venimos de crear el pedido, NuevoPedidoView deja una marca en el historial
const resultado = ref(history.state?.creado ? { tipo: 'ok', texto: 'Pedido creado. El stock ya se descontó.' } : null);

const seleccionado = computed(() => elegido.value ?? pedido.value?.estado);

// Si se navega de un pedido a otro, se limpia lo elegido y el mensaje
watch(id, () => {
  elegido.value = null;
  resultado.value = null;
});

async function guardarEstado() {
  guardando.value = true;
  resultado.value = null;
  try {
    await api(`/pedidos/${id.value}/estado`, { metodo: 'PATCH', cuerpo: { estado: elegido.value } });
    resultado.value = { tipo: 'ok', texto: `Estado actualizado a «${etiquetaEstado(elegido.value)}».` };
    elegido.value = null;
    recargar();
  } catch (err) {
    resultado.value = { tipo: 'error', texto: err.message };
  } finally {
    guardando.value = false;
  }
}
</script>

<template>
  <section v-if="error">
    <h1>Pedido <span class="num-h1">#{{ id }}</span></h1>
    <AvisoMensaje tipo="error">{{ error }}</AvisoMensaje>
    <p><RouterLink to="/pedidos">Volver al listado</RouterLink></p>
  </section>

  <section v-else-if="!pedido">
    <h1>Pedido <span class="num-h1">#{{ id }}</span></h1>
    <p class="vacio">{{ cargando ? 'Cargando pedido…' : '' }}</p>
  </section>

  <section v-else>
    <p class="migas"><RouterLink to="/pedidos">Pedidos</RouterLink></p>
    <h1>Pedido <span class="num-h1">#{{ pedido.id }}</span></h1>

    <AvisoMensaje v-if="resultado" :tipo="resultado.tipo">{{ resultado.texto }}</AvisoMensaje>

    <dl class="datos">
      <div>
        <dt>Cliente</dt>
        <dd>{{ pedido.cliente }}</dd>
      </div>
      <div>
        <dt>Fecha</dt>
        <dd>{{ fecha(pedido.fecha_pedido) }}</dd>
      </div>
      <div>
        <dt>Notas</dt>
        <dd>{{ pedido.notas || 'Sin notas' }}</dd>
      </div>
    </dl>

    <FlujoEstado :estado="pedido.estado" />

    <div class="editor-estado">
      <label for="estado">Cambiar estado</label>
      <select id="estado" :value="seleccionado" @change="elegido = $event.target.value">
        <option v-for="e in ESTADOS" :key="e" :value="e">{{ etiquetaEstado(e) }}</option>
      </select>
      <button
        type="button"
        class="boton boton--primario"
        :disabled="guardando || seleccionado === pedido.estado"
        @click="guardarEstado"
      >
        {{ guardando ? 'Guardando…' : 'Guardar estado' }}
      </button>
    </div>
    <AvisoMensaje v-if="seleccionado === 'cancelado' && seleccionado !== pedido.estado" tipo="info">
      Cancelar un pedido no devuelve las unidades al stock.
    </AvisoMensaje>

    <h2>Productos</h2>
    <div class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" class="numero">Cantidad</th>
            <th scope="col" class="numero">Precio unitario</th>
            <th scope="col" class="numero">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pedido.items" :key="item.producto_id">
            <td>{{ item.producto }}</td>
            <td class="numero">{{ item.cantidad }}</td>
            <td class="numero">{{ moneda(item.precio_unitario) }}</td>
            <td class="numero">{{ moneda(item.cantidad * item.precio_unitario) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="3">Total</th>
            <td class="numero">{{ moneda(pedido.total) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>

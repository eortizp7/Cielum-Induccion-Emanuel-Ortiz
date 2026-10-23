<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import AvisoMensaje from '../components/AvisoMensaje.vue';
import { useApi } from '../composables/useApi.js';
import { useDatos } from '../composables/useDatos.js';
import { moneda } from '../utils/formato.js';

const api = useApi();
const router = useRouter();
const clientes = useDatos('/clientes');
const productos = useDatos('/productos');

// Estado del formulario. Cada línea lleva un id propio: sirve como :key al pintar la lista.
let siguienteId = 1;
const clienteId = ref('');
const notas = ref('');
// reactive no hace falta: ref con un arreglo también es profundo, y v-model puede editar cada línea directo
const lineas = ref([{ id: 0, productoId: '', cantidad: 1 }]);
const enviando = ref(false);
const error = ref('');

const catalogo = computed(() => productos.datos.value ?? []);
const productoPorId = computed(() => new Map(catalogo.value.map((p) => [String(p.id), p])));
const idsElegidos = computed(() => new Set(lineas.value.map((l) => l.productoId)));

function agregarLinea() {
  lineas.value.push({ id: siguienteId++, productoId: '', cantidad: 1 }); // en Vue sí se puede mutar
}
function quitarLinea(id) {
  lineas.value = lineas.value.filter((l) => l.id !== id);
}

function subtotal(linea) {
  const producto = productoPorId.value.get(linea.productoId);
  const cantidad = Number(linea.cantidad);
  return producto && Number.isInteger(cantidad) && cantidad > 0 ? producto.precio * cantidad : null;
}

// computed: se recalcula solo cuando cambian las líneas o el catálogo
const total = computed(() => lineas.value.reduce((suma, l) => suma + (subtotal(l) ?? 0), 0));

function problemaEnFormulario() {
  if (clienteId.value === '') return 'Elige un cliente.';
  for (const l of lineas.value) {
    const producto = productoPorId.value.get(l.productoId);
    if (!producto) return 'Elige un producto en cada línea, o quita las líneas que no uses.';
    const cantidad = Number(l.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1) return 'La cantidad debe ser un número entero mayor a 0.';
    if (cantidad > producto.stock) return `De «${producto.nombre}» solo quedan ${producto.stock} unidades.`;
  }
  return '';
}

async function enviar() {
  const problema = problemaEnFormulario();
  if (problema) {
    error.value = problema;
    return;
  }
  enviando.value = true;
  error.value = '';
  try {
    const creado = await api('/pedidos', {
      metodo: 'POST',
      cuerpo: {
        cliente_id: Number(clienteId.value),
        notas: notas.value.trim() || undefined, // si va vacío, ni se envía
        items: lineas.value.map((l) => ({ producto_id: Number(l.productoId), cantidad: Number(l.cantidad) })),
      },
    });
    router.push({ path: `/pedidos/${creado.id}`, state: { creado: true } });
  } catch (err) {
    error.value = err.message;
    enviando.value = false;
    productos.recargar(); // el stock pudo cambiar: mostramos las cifras al día
  }
}

const cargandoListas = computed(
  () => (clientes.cargando.value && !clientes.datos.value) || (productos.cargando.value && !productos.datos.value),
);
const errorListas = computed(() => clientes.error.value || productos.error.value);

function reintentarListas() {
  clientes.recargar();
  productos.recargar();
}
</script>

<template>
  <section>
    <h1>Nuevo pedido</h1>

    <AvisoMensaje v-if="errorListas" tipo="error">
      {{ errorListas }}
      <template #accion>
        <button type="button" class="boton" @click="reintentarListas">Reintentar</button>
      </template>
    </AvisoMensaje>

    <p v-else-if="cargandoListas" class="vacio">Cargando clientes y productos…</p>

    <form v-else class="formulario" novalidate @submit.prevent="enviar">
      <AvisoMensaje v-if="error" tipo="error">{{ error }}</AvisoMensaje>

      <div class="campo">
        <label for="cliente">Cliente</label>
        <select id="cliente" v-model="clienteId">
          <option value="">Elige un cliente</option>
          <option v-for="c in clientes.datos.value" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option>
        </select>
      </div>

      <fieldset class="lineas">
        <legend>Productos</legend>
        <div v-for="(linea, indice) in lineas" :key="linea.id" class="linea">
          <div class="campo">
            <label :for="`producto-${linea.id}`">Producto {{ indice + 1 }}</label>
            <select :id="`producto-${linea.id}`" v-model="linea.productoId">
              <option value="">Elige un producto</option>
              <option
                v-for="p in catalogo"
                :key="p.id"
                :value="String(p.id)"
                :disabled="p.stock === 0 || (idsElegidos.has(String(p.id)) && String(p.id) !== linea.productoId)"
              >
                {{ p.nombre }}, {{ moneda(p.precio) }} {{ p.stock === 0 ? '(sin stock)' : `(quedan ${p.stock})` }}
              </option>
            </select>
          </div>
          <div class="campo campo--corto">
            <label :for="`cantidad-${linea.id}`">Cantidad</label>
            <input
              :id="`cantidad-${linea.id}`"
              v-model.number="linea.cantidad"
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
            />
          </div>
          <p class="linea__subtotal numero">{{ subtotal(linea) === null ? '' : moneda(subtotal(linea)) }}</p>
          <button
            type="button"
            class="boton boton--texto"
            :disabled="lineas.length === 1"
            :aria-label="`Quitar producto ${indice + 1}`"
            @click="quitarLinea(linea.id)"
          >
            Quitar
          </button>
        </div>
        <button type="button" class="boton" :disabled="lineas.length >= catalogo.length" @click="agregarLinea">
          Agregar otro producto
        </button>
      </fieldset>

      <div class="campo">
        <label for="notas">Notas (opcional)</label>
        <input id="notas" v-model="notas" maxlength="255" />
      </div>

      <div class="resumen">
        <p>Total estimado <strong class="numero">{{ moneda(total) }}</strong></p>
        <div class="acciones">
          <RouterLink to="/pedidos" class="boton">Cancelar</RouterLink>
          <button type="submit" class="boton boton--primario" :disabled="enviando">
            {{ enviando ? 'Creando…' : 'Crear pedido' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

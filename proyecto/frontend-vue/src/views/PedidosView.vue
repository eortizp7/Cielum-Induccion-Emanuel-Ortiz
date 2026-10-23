<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import AvisoMensaje from '../components/AvisoMensaje.vue';
import EstadoBadge from '../components/EstadoBadge.vue';
import PaginacionPedidos from '../components/PaginacionPedidos.vue';
import { useDatos } from '../composables/useDatos.js';
import { ESTADOS, etiquetaEstado, fecha, moneda } from '../utils/formato.js';

const LIMITES = [5, 10, 20, 50];

function enteroPositivo(valor, porDefecto) {
  const n = Number(valor);
  return Number.isInteger(n) && n >= 1 ? n : porDefecto;
}

const ruta = useRoute();
const router = useRouter();

// Los filtros viven en la URL (?estado=pagado&pagina=2): se pueden recargar, compartir y volver atrás
const estado = computed(() => (ESTADOS.includes(ruta.query.estado) ? ruta.query.estado : ''));
const pagina = computed(() => enteroPositivo(ruta.query.pagina, 1));
const limite = computed(() => {
  const n = enteroPositivo(ruta.query.limite, 10);
  return LIMITES.includes(n) ? n : 10;
});

const consulta = computed(() => {
  const q = new URLSearchParams({ pagina: pagina.value, limite: limite.value });
  if (estado.value) q.set('estado', estado.value);
  return `/pedidos?${q}`;
});

// Cuando cambia la consulta (otro filtro u otra página), useDatos vuelve a pedir los datos
const { datos, cargando, error, recargar } = useDatos(consulta);

function cambiar(cambios) {
  const siguiente = { ...ruta.query };
  for (const [clave, valor] of Object.entries(cambios)) {
    if (valor === '') delete siguiente[clave];
    else siguiente[clave] = String(valor);
  }
  router.push({ query: siguiente });
}

const pedidos = computed(() => datos.value?.datos ?? []);
const hayDatos = computed(() => datos.value !== null);
</script>

<template>
  <section>
    <div class="encabezado">
      <h1>Pedidos</h1>
      <RouterLink to="/pedidos/nuevo" class="boton boton--primario">Nuevo pedido</RouterLink>
    </div>

    <div class="filtros">
      <div>
        <label for="filtro-estado">Estado</label>
        <select id="filtro-estado" :value="estado" @change="cambiar({ estado: $event.target.value, pagina: '' })">
          <option value="">Todos</option>
          <option v-for="e in ESTADOS" :key="e" :value="e">{{ etiquetaEstado(e) }}</option>
        </select>
      </div>
      <div>
        <label for="filtro-limite">Por página</label>
        <select id="filtro-limite" :value="limite" @change="cambiar({ limite: $event.target.value, pagina: '' })">
          <option v-for="n in LIMITES" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <AvisoMensaje v-if="error" tipo="error">
      {{ error }}
      <template #accion>
        <button type="button" class="boton" @click="recargar">Reintentar</button>
      </template>
    </AvisoMensaje>

    <p v-if="cargando && !hayDatos" class="vacio">Cargando pedidos…</p>

    <div v-if="hayDatos && pedidos.length === 0" class="vacio">
      <template v-if="datos.total_registros > 0">
        <p>Esta página no tiene pedidos.</p>
        <button type="button" class="boton" @click="cambiar({ pagina: '' })">Volver a la primera página</button>
      </template>
      <p v-else-if="estado">No hay pedidos con estado «{{ estado }}». Prueba con otro estado o quita el filtro.</p>
      <p v-else>Todavía no hay pedidos. <RouterLink to="/pedidos/nuevo">Crea el primero</RouterLink>.</p>
    </div>

    <div v-if="pedidos.length > 0" class="tabla-contenedor" :aria-busy="cargando">
      <table>
        <thead>
          <tr>
            <th scope="col">Pedido</th>
            <th scope="col">Cliente</th>
            <th scope="col">Fecha</th>
            <th scope="col">Estado</th>
            <th scope="col" class="numero">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pedidos" :key="p.id">
            <td><RouterLink :to="`/pedidos/${p.id}`">#{{ p.id }}</RouterLink></td>
            <td>{{ p.cliente }}</td>
            <td>{{ fecha(p.fecha_pedido) }}</td>
            <td><EstadoBadge :estado="p.estado" /></td>
            <td class="numero">{{ moneda(p.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginacionPedidos
      v-if="hayDatos && datos.total_registros > 0"
      :pagina="datos.pagina"
      :paginas="datos.paginas"
      :total="datos.total_registros"
      @cambiar="(n) => cambiar({ pagina: n === 1 ? '' : n })"
    />
  </section>
</template>

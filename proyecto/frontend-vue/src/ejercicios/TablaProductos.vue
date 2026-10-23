<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { llamarApi } from '../api/cliente.js';
import { moneda } from '../utils/formato.js';

// Ejercicio intermedio: tabla que consume GET /productos con estados de carga y error.
// Aquí el patrón va "a mano" (ref + onMounted) para verlo completo; en el proyecto lo reutiliza useDatos.
const productos = ref([]);
const cargando = ref(true);
const error = ref('');
const busqueda = ref('');
let control = null;

async function cargar() {
  control?.abort();
  control = new AbortController(); // permite cancelar si la pantalla se cierra
  cargando.value = true;
  error.value = '';
  try {
    productos.value = await llamarApi('/productos', { signal: control.signal });
  } catch (err) {
    if (err.name === 'AbortError') return;
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}

onMounted(cargar);                       // ciclo de vida: al aparecer el componente, carga
onUnmounted(() => control?.abort());     // al desaparecer, cancela la petición pendiente

// La lista filtrada se deriva de dos refs: no necesita su propio estado
const visibles = computed(() =>
  productos.value.filter((p) => p.nombre.toLowerCase().includes(busqueda.value.trim().toLowerCase())),
);
</script>

<template>
  <p v-if="cargando" class="vacio">Cargando productos…</p>

  <div v-else-if="error" class="aviso aviso--error" role="alert">
    <p>{{ error }}</p>
    <button type="button" class="boton" @click="cargar">Reintentar</button>
  </div>

  <div v-else>
    <div class="campo ejercicio__formulario">
      <label for="buscar">Buscar producto</label>
      <input id="buscar" v-model="busqueda" />
    </div>

    <p v-if="visibles.length === 0" class="ayuda">Ningún producto coincide con «{{ busqueda }}».</p>
    <div v-else class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" class="numero">Precio</th>
            <th scope="col" class="numero">Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in visibles" :key="p.id">
            <td>{{ p.nombre }}</td>
            <td class="numero">{{ moneda(p.precio) }}</td>
            <td class="numero">{{ p.stock === 0 ? 'Sin stock' : p.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="ayuda">{{ visibles.length }} de {{ productos.length }} productos</p>
  </div>
</template>

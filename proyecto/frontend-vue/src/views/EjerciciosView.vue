<script setup>
import { computed, ref } from 'vue';
import ListaTareas from '../ejercicios/ListaTareas.vue';
import SesionPinia from '../ejercicios/SesionPinia.vue';
import TablaProductos from '../ejercicios/TablaProductos.vue';

const EJERCICIOS = [
  { id: 'tareas', titulo: 'Lista de tareas', tema: 'Básico: v-for y v-model', componente: ListaTareas },
  { id: 'productos', titulo: 'Tabla de productos', tema: 'Intermedio: consumir la API (onMounted, carga y error)', componente: TablaProductos },
  { id: 'sesion', titulo: 'Pinia y guarda de ruta', tema: 'Avanzado: store con usuario y token, y router.beforeEach', componente: SesionPinia },
];

const activo = ref(EJERCICIOS[0].id);
const actual = computed(() => EJERCICIOS.find((e) => e.id === activo.value));
</script>

<template>
  <section>
    <h1>Ejercicios</h1>
    <p class="ayuda">Práctica del Día 12: cada pestaña es un componente en la carpeta ejercicios.</p>

    <div class="pestanas" role="tablist" aria-label="Ejercicios">
      <button
        v-for="e in EJERCICIOS"
        :id="`tab-${e.id}`"
        :key="e.id"
        type="button"
        role="tab"
        :aria-selected="e.id === activo"
        aria-controls="panel-ejercicio"
        :class="['pestana', { 'pestana--activa': e.id === activo }]"
        @click="activo = e.id"
      >
        {{ e.titulo }}
      </button>
    </div>

    <div id="panel-ejercicio" role="tabpanel" :aria-labelledby="`tab-${actual.id}`" class="ejercicio">
      <h2>{{ actual.titulo }}</h2>
      <p class="ejercicio__tema">{{ actual.tema }}</p>
      <!-- component :is pinta el componente que esté elegido -->
      <component :is="actual.componente" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

// Ejercicio básico: lista de tareas con v-for y v-model.
const tareas = ref([]);
const texto = ref('');
let siguienteId = 1; // id estable para la :key (no usamos el índice)

function agregar() {
  if (texto.value.trim() === '') return;
  // En Vue se puede modificar el arreglo directo: la reactividad detecta el push
  tareas.value.push({ id: siguienteId++, texto: texto.value.trim(), hecha: false });
  texto.value = '';
}

function quitar(id) {
  tareas.value = tareas.value.filter((t) => t.id !== id);
}

// computed: se recalcula solo cuando cambian las tareas
const pendientes = computed(() => tareas.value.filter((t) => !t.hecha).length);
</script>

<template>
  <div>
    <form class="ejercicio__fila" @submit.prevent="agregar">
      <div class="campo">
        <label for="tarea">Nueva tarea</label>
        <!-- v-model: lo que se escribe actualiza "texto", y si "texto" cambia, el input también -->
        <input id="tarea" v-model="texto" />
      </div>
      <button type="submit" class="boton boton--primario">Agregar</button>
    </form>

    <p v-if="tareas.length === 0" class="ayuda">Todavía no hay tareas. Escribe una y pulsa Agregar.</p>
    <template v-else>
      <ul class="tareas">
        <li v-for="t in tareas" :key="t.id" :class="['tarea', { 'tarea--hecha': t.hecha }]">
          <label class="tarea__texto">
            <!-- v-model en un checkbox: marca o desmarca t.hecha directamente -->
            <input v-model="t.hecha" type="checkbox" />
            <span>{{ t.texto }}</span>
          </label>
          <button type="button" class="boton boton--texto" @click="quitar(t.id)">Quitar</button>
        </li>
      </ul>
      <p class="ayuda">
        {{ pendientes }} {{ pendientes === 1 ? 'pendiente' : 'pendientes' }} de {{ tareas.length }}
      </p>
    </template>
  </div>
</template>

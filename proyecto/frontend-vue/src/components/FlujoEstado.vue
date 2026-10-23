<script setup>
import { computed } from 'vue';
import { etiquetaEstado } from '../utils/formato.js';

// El camino normal de un pedido. "cancelado" no es un paso: es una salida del camino.
const PASOS = ['pendiente', 'pagado', 'enviado', 'entregado'];

const props = defineProps({
  estado: { type: String, required: true },
});

const actual = computed(() => PASOS.indexOf(props.estado));
</script>

<template>
  <p v-if="estado === 'cancelado'" class="flujo-cancelado">Este pedido fue cancelado.</p>
  <ol v-else class="flujo" aria-label="Avance del pedido">
    <li
      v-for="(paso, i) in PASOS"
      :key="paso"
      :class="{ hecho: i < actual, actual: i === actual }"
      :aria-current="i === actual ? 'step' : undefined"
    >
      {{ etiquetaEstado(paso) }}
    </li>
  </ol>
</template>

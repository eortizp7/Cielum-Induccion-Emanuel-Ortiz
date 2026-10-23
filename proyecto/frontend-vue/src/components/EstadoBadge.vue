<script setup>
import { etiquetaEstado } from '../utils/formato.js';

// Props: el padre manda el estado y este componente solo lo muestra (no lo cambia)
defineProps({
  estado: { type: String, required: true },
});
</script>

<template>
  <span :class="['estado', `estado--${estado}`]">{{ etiquetaEstado(estado) }}</span>
</template>

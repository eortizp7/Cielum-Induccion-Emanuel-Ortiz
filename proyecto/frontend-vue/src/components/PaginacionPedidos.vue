<script setup>
// Props hacia abajo (datos de la página) y emits hacia arriba (el padre decide qué hacer al cambiar)
defineProps({
  pagina: { type: Number, required: true },
  paginas: { type: Number, required: true },
  total: { type: Number, required: true },
});
const emit = defineEmits(['cambiar']);
</script>

<template>
  <nav class="paginacion" aria-label="Paginación">
    <p>
      Página {{ pagina }} de {{ Math.max(paginas, 1) }}, {{ total }} {{ total === 1 ? 'pedido' : 'pedidos' }} en total
    </p>
    <div class="paginacion__botones">
      <button type="button" class="boton" :disabled="pagina <= 1" @click="emit('cambiar', pagina - 1)">
        Anterior
      </button>
      <button type="button" class="boton" :disabled="pagina >= paginas" @click="emit('cambiar', pagina + 1)">
        Siguiente
      </button>
    </div>
  </nav>
</template>

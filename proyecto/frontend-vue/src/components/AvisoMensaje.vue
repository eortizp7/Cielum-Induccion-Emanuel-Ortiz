<script setup>
// Mensaje para el usuario: tipo "error", "ok" o "info". Los errores se anuncian a lectores de pantalla.
// El texto llega por el slot por defecto y un botón opcional por el slot "accion".
defineProps({
  tipo: { type: String, default: 'info' },
});
</script>

<template>
  <div :class="['aviso', `aviso--${tipo}`]" :role="tipo === 'error' ? 'alert' : 'status'">
    <p><slot /></p>
    <slot name="accion" />
  </div>
</template>

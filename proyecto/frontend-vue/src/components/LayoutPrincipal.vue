<script setup>
import { computed, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const ruta = useRoute();
const router = useRouter();

// "Pedidos" también cubre el detalle (/pedidos/5), pero no /pedidos/nuevo
const pedidosActivo = computed(() => ruta.path.startsWith('/pedidos') && ruta.path !== '/pedidos/nuevo');

// La guarda solo corre al navegar. Si la sesión se cierra estando aquí (botón o 401 de la API),
// este watch lo nota y manda al login.
watch(
  () => auth.autenticado,
  (autenticado) => {
    if (!autenticado) router.replace({ name: 'login', query: { desde: ruta.fullPath } });
  },
);
</script>

<template>
  <header class="barra">
    <div class="barra__contenido">
      <RouterLink to="/pedidos" class="marca">Tienda</RouterLink>
      <nav aria-label="Principal" class="barra__nav">
        <RouterLink to="/pedidos" :class="{ activo: pedidosActivo }">Pedidos</RouterLink>
        <RouterLink to="/pedidos/nuevo" exact-active-class="activo">Nuevo pedido</RouterLink>
        <RouterLink to="/ejercicios" active-class="activo">Ejercicios</RouterLink>
      </nav>
      <div class="barra__sesion">
        <span>{{ auth.usuario }}</span>
        <button type="button" class="boton boton--texto" @click="auth.salir()">Cerrar sesión</button>
      </div>
    </div>
  </header>
  <main class="pagina">
    <RouterView />
  </main>
</template>

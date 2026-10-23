<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AvisoMensaje from '../components/AvisoMensaje.vue';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const ruta = useRoute();
const router = useRouter();

// v-model une cada input con su ref: Vue es la "fuente de la verdad" de lo que se escribe
const usuario = ref('');
const clave = ref('');
const error = ref('');
const enviando = ref(false);

async function enviar() {
  if (usuario.value.trim() === '' || clave.value === '') {
    error.value = 'Escribe tu usuario y tu clave.';
    return;
  }
  enviando.value = true;
  error.value = '';
  try {
    await auth.entrar(usuario.value.trim(), clave.value);
    const desde = typeof ruta.query.desde === 'string' ? ruta.query.desde : '/pedidos';
    router.replace(desde); // vuelve a donde quería ir (o al listado)
  } catch (err) {
    error.value = err.status === 401 ? 'Usuario o clave incorrectos.' : err.message;
    enviando.value = false;
  }
}
</script>

<template>
  <main class="login">
    <div class="login__lado" aria-hidden="true">
      <strong>tienda</strong>
      <ol class="login__numeros">
        <li>#22</li>
        <li>#21</li>
        <li>#20</li>
        <li>#19</li>
      </ol>
    </div>
    <!-- .prevent evita que el navegador recargue la página (como preventDefault en React) -->
    <form class="login__formulario" novalidate @submit.prevent="enviar">
      <h1>Iniciar sesión</h1>
      <p class="ayuda">Panel de pedidos de la tienda (versión Vue).</p>

      <AvisoMensaje v-if="auth.aviso" tipo="info">{{ auth.aviso }}</AvisoMensaje>
      <AvisoMensaje v-if="error" tipo="error">{{ error }}</AvisoMensaje>

      <label for="usuario">Usuario</label>
      <input id="usuario" v-model="usuario" autocomplete="username" autofocus />

      <label for="clave">Clave</label>
      <input id="clave" v-model="clave" type="password" autocomplete="current-password" />

      <button type="submit" class="boton boton--primario" :disabled="enviando">
        {{ enviando ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
  </main>
</template>

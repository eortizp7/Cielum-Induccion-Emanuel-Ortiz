<script setup>
import { computed, ref } from 'vue';
import { useApi } from '../composables/useApi.js';
import { leerPayload, useAuthStore } from '../stores/auth.js';
import { fecha } from '../utils/formato.js';

// Ejercicio avanzado: el store de Pinia con el usuario y el token, y la guarda de ruta.
// El store está en src/stores/auth.js y la guarda en src/router/index.js (router.beforeEach).
const auth = useAuthStore();
const api = useApi();

const payload = computed(() => (auth.token ? leerPayload(auth.token) : null));
const resultado = ref('');

async function probarRutaProtegida() {
  resultado.value = 'Llamando a GET /pedidos?limite=1…';
  try {
    const datos = await api('/pedidos?limite=1');
    resultado.value = `200 OK: la API aceptó el token (${datos.total_registros} pedidos en total).`;
  } catch (err) {
    resultado.value = `${err.status}: ${err.message}`;
  }
}

function simularTokenVencido() {
  // Cambia el token por uno falso: la próxima llamada da 401, useApi cierra la sesión
  // y el layout manda al login con el aviso "Tu sesión expiró".
  auth.token = 'token.falso.123';
  probarRutaProtegida();
}
</script>

<template>
  <div>
    <dl class="datos">
      <div>
        <dt>Usuario (store)</dt>
        <dd>{{ auth.usuario }}</dd>
      </div>
      <div>
        <dt>¿Autenticado? (computed)</dt>
        <dd>{{ auth.autenticado ? 'Sí' : 'No' }}</dd>
      </div>
      <div>
        <dt>Vence</dt>
        <dd>{{ payload ? fecha(payload.exp * 1000) : '—' }}</dd>
      </div>
    </dl>

    <div class="ejercicio__fila">
      <button type="button" class="boton boton--primario" @click="probarRutaProtegida">Probar ruta protegida</button>
      <button type="button" class="boton" @click="simularTokenVencido">Simular token inválido (401)</button>
    </div>
    <p v-if="resultado" class="ayuda">{{ resultado }}</p>

    <p class="ayuda">
      Guarda de ruta: abre una pestaña privada y entra a <code>/pedidos</code> sin sesión. El
      <code>router.beforeEach</code> te manda a <code>/login?desde=/pedidos</code>, y después del login vuelves ahí.
    </p>
  </div>
</template>

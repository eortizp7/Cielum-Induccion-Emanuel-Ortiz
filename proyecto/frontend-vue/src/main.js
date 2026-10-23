import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import '@fontsource-variable/bricolage-grotesque/wdth.css'; // misma fuente que el front de React
import './index.css'; // mismos estilos que el front de React, para comparar solo el código

// Orden: primero Pinia (el estado global), después el router, porque la guarda de ruta usa el store
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

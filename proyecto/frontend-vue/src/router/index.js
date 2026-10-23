import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import LayoutPrincipal from '../components/LayoutPrincipal.vue';
import LoginView from '../views/LoginView.vue';
import PedidosView from '../views/PedidosView.vue';
import NuevoPedidoView from '../views/NuevoPedidoView.vue';
import PedidoDetalleView from '../views/PedidoDetalleView.vue';
import EjerciciosView from '../views/EjerciciosView.vue';
import NoEncontradaView from '../views/NoEncontradaView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    {
      // Todo lo que está aquí adentro exige sesión (meta.requiereSesion) y va dentro del layout
      path: '/',
      component: LayoutPrincipal,
      meta: { requiereSesion: true },
      children: [
        { path: '', redirect: '/pedidos' },
        { path: 'pedidos', name: 'pedidos', component: PedidosView },
        { path: 'pedidos/nuevo', name: 'nuevo-pedido', component: NuevoPedidoView },
        { path: 'pedidos/:id', name: 'pedido', component: PedidoDetalleView },
        { path: 'ejercicios', name: 'ejercicios', component: EjerciciosView },
        { path: ':ruta(.*)*', name: 'no-encontrada', component: NoEncontradaView },
      ],
    },
  ],
});

// Guarda de navegación: se ejecuta ANTES de entrar a cada ruta.
// Es el equivalente del componente <RutaProtegida> de React.
router.beforeEach((destino) => {
  const auth = useAuthStore();
  auth.revisarVencimiento();

  // Sin sesión a una ruta protegida: al login, recordando a dónde quería ir
  if (destino.meta.requiereSesion && !auth.autenticado) {
    return { name: 'login', query: { desde: destino.fullPath } };
  }
  // Con sesión al login: no tiene sentido, se va a los pedidos
  if (destino.name === 'login' && auth.autenticado) {
    return typeof destino.query.desde === 'string' ? destino.query.desde : { name: 'pedidos' };
  }
  return true; // dejar pasar
});

export default router;

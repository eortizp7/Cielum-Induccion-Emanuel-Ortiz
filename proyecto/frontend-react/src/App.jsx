import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Ejercicios from './pages/Ejercicios.jsx';
import Login from './pages/Login.jsx';
import NuevoPedido from './pages/NuevoPedido.jsx';
import PedidoDetalle from './pages/PedidoDetalle.jsx';
import Pedidos from './pages/Pedidos.jsx';

function NoEncontrada() {
  return (
    <section>
      <h1>Esta página no existe</h1>
      <p>
        Revisa la dirección o vuelve al <Link to="/pedidos">listado de pedidos</Link>.
      </p>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Todo lo que está dentro de RutaProtegida exige haber iniciado sesión */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/pedidos" replace />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedidos/nuevo" element={<NuevoPedido />} />
          <Route path="/pedidos/:id" element={<PedidoDetalle />} />
          <Route path="/ejercicios" element={<Ejercicios />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}

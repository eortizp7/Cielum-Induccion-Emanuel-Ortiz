import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

export default function Layout() {
  const { usuario, salir } = useAuth();
  const { pathname } = useLocation();
  const enNuevo = pathname === '/pedidos/nuevo';

  return (
    <>
      <header className="barra">
        <div className="barra__contenido">
          <NavLink to="/pedidos" className="marca">
            Tienda
          </NavLink>
          <nav aria-label="Principal" className="barra__nav">
            {/* "Pedidos" también cubre el detalle (/pedidos/5), pero no /pedidos/nuevo */}
            <NavLink to="/pedidos" className={({ isActive }) => (isActive && !enNuevo ? 'activo' : '')}>
              Pedidos
            </NavLink>
            <NavLink to="/pedidos/nuevo" end>
              Nuevo pedido
            </NavLink>
          </nav>
          <div className="barra__sesion">
            <span>{usuario}</span>
            {/* () => salir(): si pasáramos salir directo, el evento del clic llegaría como "motivo" */}
            <button type="button" className="boton boton--texto" onClick={() => salir()}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="pagina">
        <Outlet />
      </main>
    </>
  );
}

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

// Ruta protegida: sin sesión, manda al login y recuerda a dónde quería ir el usuario
export default function RutaProtegida() {
  const { autenticado } = useAuth();
  const ubicacion = useLocation();

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
  }
  return <Outlet />;
}

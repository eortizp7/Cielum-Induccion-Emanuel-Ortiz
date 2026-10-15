import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Aviso from '../components/Aviso.jsx';
import { useAuth } from '../auth/useAuth.js';

export default function Login() {
  const { autenticado, aviso, entrar } = useAuth();
  const ubicacion = useLocation();

  // Formulario controlado: React es la "fuente de la verdad" de lo que se escribe
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Ya hay sesión: vuelve a donde estaba (o al listado)
  if (autenticado) {
    return <Navigate to={ubicacion.state?.desde ?? '/pedidos'} replace />;
  }

  async function enviar(evento) {
    evento.preventDefault(); // sin esto el navegador recargaría la página
    if (usuario.trim() === '' || clave === '') {
      setError('Escribe tu usuario y tu clave.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await entrar(usuario.trim(), clave); // al entrar, este componente se reemplaza por el <Navigate> de arriba
    } catch (err) {
      setError(err.status === 401 ? 'Usuario o clave incorrectos.' : err.message);
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <div className="login__lado" aria-hidden="true">
        <strong>tienda</strong>
        <ol className="login__numeros">
          <li>#22</li>
          <li>#21</li>
          <li>#20</li>
          <li>#19</li>
        </ol>
      </div>
      <form className="login__formulario" onSubmit={enviar} noValidate>
        <h1>Iniciar sesión</h1>
        <p className="ayuda">Panel de pedidos de la tienda.</p>

        {aviso && <Aviso tipo="info">{aviso}</Aviso>}
        {error && <Aviso tipo="error">{error}</Aviso>}

        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          autoComplete="username"
          autoFocus
        />

        <label htmlFor="clave">Clave</label>
        <input
          id="clave"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" className="boton boton--primario" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

// Mensaje para el usuario: tipo "error", "ok" o "info". Los errores se anuncian a lectores de pantalla.
export default function Aviso({ tipo = 'info', accion = null, children }) {
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <p>{children}</p>
      {accion}
    </div>
  );
}

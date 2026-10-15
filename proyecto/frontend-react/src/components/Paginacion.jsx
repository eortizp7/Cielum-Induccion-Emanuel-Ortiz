export default function Paginacion({ pagina, paginas, total, onCambiar }) {
  return (
    <nav className="paginacion" aria-label="Paginación">
      <p>
        Página {pagina} de {Math.max(paginas, 1)}, {total} {total === 1 ? 'pedido' : 'pedidos'} en total
      </p>
      <div className="paginacion__botones">
        <button type="button" className="boton" disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>
          Anterior
        </button>
        <button
          type="button"
          className="boton"
          disabled={pagina >= paginas}
          onClick={() => onCambiar(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}

import { useEffect, useState } from 'react';
import { llamarApi } from '../api/cliente.js';
import { moneda } from '../utils/formato.js';

// Ejercicio 2: tabla que consume GET /productos con estados de carga y error.
// Aquí el patrón va "a mano" (useState + useEffect) para verlo completo; en el proyecto lo reutiliza useDatos.
export default function TablaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0); // cambiarlo vuelve a ejecutar el efecto
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const control = new AbortController(); // permite cancelar si la pantalla se cierra

    llamarApi('/productos', { signal: control.signal })
      .then((datos) => {
        setProductos(datos);
        setError('');
        setCargando(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setCargando(false);
      });

    return () => control.abort(); // limpieza
  }, [intento]);

  function reintentar() {
    setCargando(true);
    setError('');
    setIntento(intento + 1);
  }

  // La lista filtrada se calcula en cada render a partir de dos estados: no necesita su propio estado
  const visibles = productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()));

  if (cargando) return <p className="vacio">Cargando productos…</p>;

  if (error) {
    return (
      <div className="aviso aviso--error" role="alert">
        <p>{error}</p>
        <button type="button" className="boton" onClick={reintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="campo ejercicio__formulario">
        <label htmlFor="buscar">Buscar producto</label>
        <input id="buscar" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      {visibles.length === 0 ? (
        <p className="ayuda">Ningún producto coincide con «{busqueda}».</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col" className="numero">
                  Precio
                </th>
                <th scope="col" className="numero">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="numero">{moneda(p.precio)}</td>
                  <td className="numero">{p.stock === 0 ? 'Sin stock' : p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ayuda">
        {visibles.length} de {productos.length} productos
      </p>
    </div>
  );
}

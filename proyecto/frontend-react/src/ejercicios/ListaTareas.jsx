import { useRef, useState } from 'react';

// Ejercicio 1b: lista dinámica. Agregar, tachar y quitar tareas, sin mutar el arreglo.
export default function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState('');
  const siguienteId = useRef(1); // id estable para la key (no usamos el índice)

  function agregar(evento) {
    evento.preventDefault();
    if (texto.trim() === '') return;
    // Se crea un arreglo NUEVO con el spread: así React nota el cambio
    setTareas([...tareas, { id: siguienteId.current++, texto: texto.trim(), hecha: false }]);
    setTexto('');
  }

  function alternar(id) {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t)));
  }

  function quitar(id) {
    setTareas(tareas.filter((t) => t.id !== id));
  }

  const pendientes = tareas.filter((t) => !t.hecha).length; // estado derivado: no hace falta otro useState

  return (
    <div>
      <form onSubmit={agregar} className="ejercicio__fila">
        <div className="campo">
          <label htmlFor="tarea">Nueva tarea</label>
          <input id="tarea" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <button type="submit" className="boton boton--primario">
          Agregar
        </button>
      </form>

      {tareas.length === 0 ? (
        <p className="ayuda">Todavía no hay tareas. Escribe una y pulsa Agregar.</p>
      ) : (
        <>
          <ul className="tareas">
            {tareas.map((t) => (
              <li key={t.id} className={t.hecha ? 'tarea tarea--hecha' : 'tarea'}>
                <label className="tarea__texto">
                  <input type="checkbox" checked={t.hecha} onChange={() => alternar(t.id)} />
                  <span>{t.texto}</span>
                </label>
                <button type="button" className="boton boton--texto" onClick={() => quitar(t.id)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p className="ayuda">
            {pendientes} {pendientes === 1 ? 'pendiente' : 'pendientes'} de {tareas.length}
          </p>
        </>
      )}
    </div>
  );
}

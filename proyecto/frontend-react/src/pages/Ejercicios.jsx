import { useState } from 'react';
import Contador from '../ejercicios/Contador.jsx';
import FormularioControlado from '../ejercicios/FormularioControlado.jsx';
import ListaTareas from '../ejercicios/ListaTareas.jsx';
import ProbarApi from '../ejercicios/ProbarApi.jsx';
import TablaProductos from '../ejercicios/TablaProductos.jsx';

const EJERCICIOS = [
  { id: 'contador', titulo: 'Contador', tema: 'useState y eventos', Componente: Contador },
  { id: 'tareas', titulo: 'Lista de tareas', tema: 'listas, key y estado sin mutar', Componente: ListaTareas },
  { id: 'formulario', titulo: 'Formulario', tema: 'formulario controlado y validación', Componente: FormularioControlado },
  { id: 'productos', titulo: 'Tabla de productos', tema: 'useEffect, carga y error', Componente: TablaProductos },
  { id: 'api', titulo: 'useApi y ruta protegida', tema: 'token, 401 y rutas protegidas', Componente: ProbarApi },
];

export default function Ejercicios() {
  const [activo, setActivo] = useState(EJERCICIOS[0].id);
  const actual = EJERCICIOS.find((e) => e.id === activo);
  const { Componente } = actual;

  return (
    <section>
      <h1>Ejercicios</h1>
      <p className="ayuda">Práctica del Día 11: cada pestaña es un componente en la carpeta ejercicios.</p>

      <div className="pestanas" role="tablist" aria-label="Ejercicios">
        {EJERCICIOS.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            id={`tab-${e.id}`}
            aria-selected={e.id === activo}
            aria-controls="panel-ejercicio"
            className={e.id === activo ? 'pestana pestana--activa' : 'pestana'}
            onClick={() => setActivo(e.id)}
          >
            {e.titulo}
          </button>
        ))}
      </div>

      <div id="panel-ejercicio" role="tabpanel" aria-labelledby={`tab-${actual.id}`} className="ejercicio">
        <h2>{actual.titulo}</h2>
        <p className="ejercicio__tema">{actual.tema}</p>
        <Componente />
      </div>
    </section>
  );
}

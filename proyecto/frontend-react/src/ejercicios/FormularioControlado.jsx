import { useState } from 'react';

const VACIO = { nombre: '', correo: '', mensaje: '' };

// Ejercicio 1c: formulario controlado. React guarda lo escrito; el navegador solo lo muestra.
export default function FormularioControlado() {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(null);

  // Un solo manejador para todos los campos: usa el atributo name del input como llave
  function cambiar(evento) {
    const { name, value } = evento.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const nuevos = {};
    if (form.nombre.trim() === '') nuevos.nombre = 'Escribe tu nombre.';
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) nuevos.correo = 'Escribe un correo válido.';
    if (form.mensaje.trim().length < 10) nuevos.mensaje = 'El mensaje debe tener al menos 10 letras.';
    return nuevos;
  }

  function enviar(evento) {
    evento.preventDefault(); // sin esto el navegador recargaría la página
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) {
      setEnviado(form);
      setForm(VACIO);
    }
  }

  return (
    <div>
      <form onSubmit={enviar} noValidate className="ejercicio__formulario">
        <div className="campo">
          <label htmlFor="f-nombre">Nombre</label>
          <input id="f-nombre" name="nombre" value={form.nombre} onChange={cambiar} />
          {errores.nombre && <p className="ejercicio__error">{errores.nombre}</p>}
        </div>
        <div className="campo">
          <label htmlFor="f-correo">Correo</label>
          <input id="f-correo" name="correo" value={form.correo} onChange={cambiar} />
          {errores.correo && <p className="ejercicio__error">{errores.correo}</p>}
        </div>
        <div className="campo">
          <label htmlFor="f-mensaje">Mensaje</label>
          <input id="f-mensaje" name="mensaje" value={form.mensaje} onChange={cambiar} />
          {errores.mensaje && <p className="ejercicio__error">{errores.mensaje}</p>}
        </div>
        <button type="submit" className="boton boton--primario">
          Enviar
        </button>
      </form>

      <p className="ayuda">Lo que React tiene guardado ahora: {JSON.stringify(form)}</p>
      {enviado && (
        <p className="aviso aviso--ok">
          Enviado: {enviado.nombre} ({enviado.correo})
        </p>
      )}
    </div>
  );
}

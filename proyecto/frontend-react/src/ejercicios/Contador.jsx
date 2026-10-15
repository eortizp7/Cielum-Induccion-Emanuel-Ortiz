import { useState } from 'react';

// Ejercicio 1a: useState básico. Un número que cambia con eventos (onClick).
export default function Contador() {
  const [cuenta, setCuenta] = useState(0);

  return (
    <div>
      <p className="ejercicio__numero">{cuenta}</p>
      <div className="acciones">
        <button type="button" className="boton" onClick={() => setCuenta(cuenta - 1)} disabled={cuenta === 0}>
          Restar
        </button>
        <button type="button" className="boton boton--primario" onClick={() => setCuenta(cuenta + 1)}>
          Sumar
        </button>
        <button type="button" className="boton boton--texto" onClick={() => setCuenta(0)}>
          Reiniciar
        </button>
      </div>
      {/* Renderizado condicional: el mensaje solo existe cuando se cumple la condición */}
      {cuenta >= 10 && <p className="ayuda">¡Llegaste a 10!</p>}
    </div>
  );
}

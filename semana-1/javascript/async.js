// Ejercicios de asincronía - Día 3
// Emanuel Ortiz

// ===========================================
// Ejercicio básico: clase Pedido
// ===========================================
class Pedido {
    constructor (){
        this.items = [];
    }

    agregarItem(nombre, precio){

        let item = {
            nombre:nombre,
            precio:precio
        }

        this.items.push(item);
    }

    calcularTotal(){

        let Total = 0
        for (let i=0; i < this.items.length; i++){
            Total += this.items[i].precio;
        }
        return Total;
    }

    aplicarDescuento(porcentaje){
        let Total = this.calcularTotal();
        let valorDescuento = Total * porcentaje /100;
        let totalDescuento = Total - valorDescuento;

        return  totalDescuento;
    }

}

const pedido = new Pedido();
pedido.agregarItem("Taladro Bosch", 150000);
pedido.agregarItem("Sierra Dewalt", 320000);

console.log("Total sin descuento:", pedido.calcularTotal());
console.log("Total con 10% descuento:", pedido.aplicarDescuento(10));

// ===========================================
// Ejercicio intermedio: esperar(ms) + Promise.all / Promise.allSettled
// Función esperar(ms) que usa promesas para pausar la ejecución.
// Simula 3 llamadas a "servicios" con tiempos distintos.
// ===========================================

function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function servicioA() {
  await esperar(1000);
  return "Servicio A";
}

async function servicioB() {
  await esperar(2000);
  return "Servicio B";
}

async function servicioC() {
  await esperar(500);
  return "Servicio C";
}

async function probarPromiseAll() {
  console.log("Probando promise ALL con los tres servicios");

  try {
    let resultados = await Promise.all([servicioA(), servicioB(), servicioC()]);
    console.log("Todos los resultados", resultados);
  } catch (error) {
    console.log("Falla presentada por:", error.message);
  }
}

async function probarPromiseAllSettled() {
  console.log("--- Probando Promise.allSettled ---");
  const resultados = await Promise.allSettled([servicioA(), servicioB(), servicioC()]);
  console.log("Resultados:", resultados);
}

probarPromiseAll();
probarPromiseAllSettled();


// ===========================================
// Ejercicio avanzado: predecir orden de ejecución
// Predicción: 1, 2, 6, 4, 5, 3
// Justificación: primero corre todo el código síncrono (1, 2 dentro
// de miFuncion antes de su await, y 6). Luego se vacía la microtask
// queue con las promesas encadenadas (4, 5). Al final, la macrotask
// queue resuelve el await esperar(0) dentro de miFuncion (3), porque
// por dentro usa setTimeout.
// ===========================================

console.log("1");

async function miFuncion() {
  console.log("2");
  await esperar(0);
  console.log("3");
}

miFuncion();

Promise.resolve()
  .then(() => console.log("4"))
  .then(() => console.log("5"));

console.log("6");
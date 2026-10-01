// Fundamentos de JavaScript - Día 2
// Emanuel Ortiz

// ===========================================
// Ejercicio 1: Tipos de datos
// Crea una variable de cada tipo: string, number, boolean,
// array y object, relacionados con un paciente.
// Imprime los 5 con console.log.
// ===========================================

let nomnbrePaciente = "Andres Camilo Suarez"
let edadPaciente = 40
let estadoActivo = true
let medicamentos = ["Acetaminofén", "Ibuprofeno", "Amoxicilina"];
let cita = {Especialidad : "Odontología", Fecha : "1/10/2023" , Hora : "8:00am"}

console.log("Ejercicio #1");
console.log(nomnbrePaciente, edadPaciente, estadoActivo, medicamentos, cita);

// ===========================================
// Ejercicio 2: let vs const
// Declara con const algo que no cambia (ej: nombre de la EPS)
// y con let algo que sí cambia (ej: contador de pacientes).
// Suma 1 al contador dos veces e imprime el resultado.
// ===========================================

const nombreEps = "Sura"
let contadorPacientes = 0

console.log("Ejercicio #2");
for (let i=0; i<=1; i++){

    contadorPacientes +=1;
    console.log(contadorPacientes);
}

// ===========================================
// Ejercicio 3: == vs ===
// Compara un string "30" con el number 30 usando == y ===.
// Imprime ambos resultados.
// ===========================================

console.log("Ejercicio #3");
if (edadPaciente == "40"){
    console.log("Paciente adulto");
}else{
    console.log("Paciente joven");
}

if (edadPaciente === "40"){
    console.log("Paciente adulto");
}else{
    console.log("Paciente joven");
}

// ===========================================
// Ejercicio 4: if/else
// Dada una edad, imprime "Pediatría" si es menor a 18,
// o "Medicina general" si es 18 o más.
// ===========================================

let edadPaciente1 = 15;

console.log("Ejercicio #4");
if(edadPaciente1 < 18){
    console.log("Paciente Pediatría");
}else{
    console.log("Medicina general"); 
}

// ===========================================
// Ejercicio 5: if/else if/else
// Dado un estado ("CREADO", "ERROR", "PENDIENTE"),
// imprime un mensaje distinto para cada caso.
// ===========================================

let estado = "CREADO";

console.log("Ejercicio #5");
if (estado === "CREADO"){
    console.log("Paciente creado correctamente");
}else if(estado ==="PENDIENTE") {
    console.log("Paciente pendeinte por crear")
}else if(estado === "ERROR"){
    console.log("Error al crear el paciente")
}


// ===========================================
// Ejercicio 6: Bucle for
// Imprime los números del 1 al 10 (simulando 10 citas).
// ===========================================

let turnoCita = 1;

console.log("Ejercicio #6");
for (let i = 1; i<11; i++){
    console.log(turnoCita); 
    turnoCita +=1;
}

// ===========================================
// Ejercicio 7: Bucle while
// Empieza con 8 pacientes en espera, y ve restando de 1 en 1
// hasta llegar a 0, imprimiendo cada paso.
// ===========================================

let pacientesEspera = 10;

console.log("Ejercicio #7");
while (pacientesEspera > 0){
    console.log(pacientesEspera);
    pacientesEspera -=1;

}

// ===========================================
// Ejercicio 8: Función normal
// Crea una función que calcule la edad a partir del
// año de nacimiento y el año actual.
// ===========================================

function CalcularEdad(añoNacimiento, añoActual){
    return añoActual-añoNacimiento
}

console.log("Ejercicio #8");
console.log(CalcularEdad(1994,2026));

// ===========================================
// Ejercicio 9: Función flecha
// Reescribe la función anterior como arrow function.
// ===========================================

let CalcularEdadFlecha = (añoNacimiento, añoActual) => {
return (añoActual-añoNacimiento)
}

console.log("Ejercicio #9");
console.log(CalcularEdadFlecha(1987,2026));

// ===========================================
// Ejercicio 10: Arrays y objetos
// Crea un array con 3 especialidades médicas (strings).
// Crea un objeto con nombre, edad y diagnóstico de un paciente.
// Imprime ambos.
// ==========================================

let Especialidades = ["Odontologia", "Cardiologia", "Pediatria"];
let PacientesResumen = {nombre : "Camilo Ortiz Gonzales", edad : 88, diagnostico : "Reservado"};
console.log("Ejercicio #10");
console.log(Especialidades, PacientesResumen);

// =================================================
// JS intermedio
// Con un arreglo de 20 pedidos ficticios {id, cliente, ciudad, total, estado}
// calcular con map/filter/reduce: total vendido, total por ciudad, 
// pedidos pendientes, pedido más caro, promedio por cliente.
// =================================================

const pedidos = [
  { id: 1, cliente: "Ana Gómez", ciudad: "Medellín", total: 150000, estado: "entregado" },
  { id: 2, cliente: "Luis Torres", ciudad: "Bogota", total: 89000, estado: "pendiente" },
  { id: 3, cliente: "Marta Ruiz", ciudad: "Medellín", total: 230000, estado: "entregado" },
  { id: 4, cliente: "Ana Gómez", ciudad: "Medellín", total: 75000, estado: "pendiente" },
  { id: 5, cliente: "Carlos Pérez", ciudad: "Cali", total: 120000, estado: "entregado" },
  { id: 6, cliente: "Luis Torres", ciudad: "Bogota", total: 340000, estado: "entregado" },
  { id: 7, cliente: "Sofía Londoño", ciudad: "Medellín", total: 45000, estado: "pendiente" },
  { id: 8, cliente: "Carlos Pérez", ciudad: "Cali", total: 98000, estado: "entregado" },
  { id: 9, cliente: "Marta Ruiz", ciudad: "Medellín", total: 180000, estado: "pendiente" },
  { id: 10, cliente: "Jorge Ramírez", ciudad: "Bogota", total: 410000, estado: "entregado" },
  { id: 11, cliente: "Ana Gómez", ciudad: "Medellín", total: 62000, estado: "entregado" },
  { id: 12, cliente: "Sofía Londoño", ciudad: "Medellín", total: 95000, estado: "entregado" },
  { id: 13, cliente: "Jorge Ramírez", ciudad: "Bogota", total: 150000, estado: "pendiente" },
  { id: 14, cliente: "Luis Torres", ciudad: "Bogotá", total: 72000, estado: "entregado" },
  { id: 15, cliente: "Carlos Pérez", ciudad: "Cali", total: 205000, estado: "pendiente" },
  { id: 16, cliente: "Marta Ruiz", ciudad: "Medellín", total: 130000, estado: "entregado" },
  { id: 17, cliente: "Jorge Ramírez", ciudad: "Bogota", total: 88000, estado: "entregado" },
  { id: 18, cliente: "Sofía Londoño", ciudad: "Medellín", total: 310000, estado: "pendiente" },
  { id: 19, cliente: "Ana Gómez", ciudad: "Medellín", total: 54000, estado: "entregado" },
  { id: 20, cliente: "Carlos Pérez", ciudad: "Cali", total: 175000, estado: "entregado" },
];


let totalVendido = pedidos.reduce((a,c) => {
    return a += c.total;
},0 );

console.log(totalVendido);


let totalPorCiudad = pedidos.reduce((a, pedido) =>{
    if (!a[pedido.ciudad]){
        a[pedido.ciudad] = 0;
    } a[pedido.ciudad] += pedido.total;
    return a;
}, {});

console.log(totalPorCiudad);


let pedidosPendientes = pedidos.filter((pedido) => pedido.estado === "pendiente");

console.log(pedidosPendientes);



let pedidoMasCaro = pedidos.reduce((a, pedido) => {
  if (pedido.total > a.total) {
    return pedido;
  }
  return a;
}, pedidos[0]);

console.log(pedidoMasCaro);


const cliente = [...new Set(pedidos.map((pedido) => pedido.cliente))];

const promedioPorCliente = cliente.map((nombreCliente) => {
  const pedidosDeEsteCliente = pedidos.filter((p) => p.cliente === nombreCliente);
  const totalCliente = pedidosDeEsteCliente.reduce((a, p) => a + p.total, 0);
  const promedio = totalCliente / pedidosDeEsteCliente.length;

  return { cliente: nombreCliente, promedio: promedio };
});
console.log("Promedio por cliente:", promedioPorCliente);


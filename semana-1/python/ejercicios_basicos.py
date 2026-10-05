# Ejercicios básicos de Python - Día 5
# Emanuel Ortiz

# ===========================================
# Ejercicio 1: Tipos de datos
# Crea una variable de cada tipo: str, int, float, bool y None,
# relacionadas con un paciente. Imprime cada una con su type().
# ===========================================

nombre = "Camilo Ortiz" 
edad = 55
peso = 85.2
activo = True
diagnostico = None

print(nombre, type(nombre))
print(edad, type(edad))
print(peso, type(peso))
print(activo, type(activo))
print(diagnostico, type(diagnostico))

# ===========================================
# Ejercicio 2: Entrada y f-strings
# Pide con input() el nombre y la edad de un paciente (convierte
# la edad a int) e imprime: "Paciente <nombre>, <edad> años".
# ===========================================

nombre2 = input("Nombre del paciente: ")
edad2 = int(input("Edad del paciente: "))
print(f"El paciente {nombre2} tiene {edad2} años")

# ===========================================
# Ejercicio 3: Operadores
# Con dos números, imprime la suma, la división normal, la división
# entera, el residuo y la potencia. Indica si el primero es par.
# ===========================================

a = 17
b = 5
print("Suma:", a + b)               
print("División:", a / b)          
print("División entera:", a // b)   
print("Residuo:", a % b)            
print("Potencia:", a ** b)          
print("¿El número es par?", a % 2 == 0)   

# ===========================================
# Ejercicio 4: if / elif / else
# Dada una edad, imprime "Pediatría" si es menor a 18,
# "Medicina general" si está entre 18 y 64, y "Geriatría" si es 65 o más.
# ===========================================

edad3 = 65

if edad3 < 18:
    print("Paciente de Pediatr+ia")

elif edad3 < 65:
    print("Paciente de Medicina general")

else :
    print("Paciente de Geriatria")

# ===========================================
# Ejercicio 5: Condicional con texto
# Dado un estado ("CREADO", "ERROR" o "PENDIENTE"), imprime un
# mensaje distinto para cada caso. Si es otro valor, imprime
# "Estado desconocido".
# ===========================================

estado = "ERROR"

if estado == "CREADO" :
    print(f"Usuario {estado} correctamente")

elif estado == "PENDIENTE" :
    print(f"Usuario se encuentra {estado}")

elif estado == "ERROR":
    print(f"Ha ocurrido un {estado}")

else : 
    print("Estado desconocido")

# ===========================================
# Ejercicio 6: Bucle for
# Imprime "Cita número N" para las citas del 1 al 10.
# ===========================================

for n in range (1,11):
    print("Cita número ",n)
    
# ===========================================
# Ejercicio 7: Bucle while
# Empieza con 8 pacientes en espera y ve restando de 1 en 1,
# imprimiendo cuántos quedan, hasta llegar a 0.
# ===========================================

en_espera = 8

while en_espera > 0 :
    print(f"En este momenot hay {en_espera} pacientes en espera")
    en_espera -= 1

# ===========================================
# Ejercicio 8: Listas
# Crea una lista con 5 edades. Imprime la cantidad, la suma, el
# mayor, el menor y el promedio. Agrega una edad y vuelve a imprimir
# la cantidad.
# ===========================================

edades = [55, 33, 44, 63, 13, 78, 93, 14]

print("Cantidad ",len(edades))
print("Suma ",sum(edades))
print("Maximo ",max(edades))
print("Minimo ",min(edades))
print("Promedio ",sum(edades) / len(edades))

edades.append(8)
print("Cantidad después de agregar:", len(edades))
print("Minimo ",min(edades))

# ===========================================
# Ejercicio 9: Diccionarios
# Crea un diccionario con nombre, edad y diagnóstico de un paciente.
# Imprímelo, cambia la edad, agrega la clave "eps" y recorre el
# diccionario con .items() imprimiendo cada pareja clave-valor.
# ===========================================

pacientes = {"nombre" : "Ana Camila", "edad" : 77, "diagnostico" : "Hipertensión"}
print(pacientes)

pacientes["edad"] = 41
pacientes["eps"] = "Sura"

for clave, valor in pacientes.items(): 
    print(f"{clave} : {valor}")

# ===========================================
# Ejercicio 10: Funciones
# Crea la función calcular_edad(anio_nacimiento, anio_actual)
# que devuelva la edad. Pruébala con el año por defecto y con uno
# que tú le pases.
# ===========================================


def calcular_edad(año_nacimiento, año_actual=2026):
    return año_actual-año_nacimiento

print(calcular_edad(1885))
print(calcular_edad(1999,2025))

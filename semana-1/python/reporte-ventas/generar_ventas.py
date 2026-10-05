import csv
import random
from datetime import date, timedelta

random.seed(42)   # mismo resultado en cada ejecución, útil para las pruebas

CIUDADES = ["Medellín", "Cali", "Bogotá", "Pereira", "Barranquilla"]
PRODUCTOS = {
    "Taladro": 150000,
    "Sierra": 320000,
    "Martillo": 45000,
    "Alicate": 28000,
    "Destornillador": 15000,
    "Nivel": 38000,
}


def fecha_aleatoria():
    inicio = date(2026, 1, 1)
    return inicio + timedelta(days=random.randint(0, 270))


def generar_filas(cantidad=200):
    filas = []
    for i in range(1, cantidad + 1):
        producto = random.choice(list(PRODUCTOS))
        cantidad_vendida = random.randint(1, 5)
        filas.append({
            "id": i,
            "fecha": fecha_aleatoria().isoformat(),
            "ciudad": random.choice(CIUDADES),
            "producto": producto,
            "total": PRODUCTOS[producto] * cantidad_vendida,
        })

    # --- Datos sucios a propósito ---
    for fila in random.sample(filas, 8):
        fila["total"] = ""                              # totales vacíos
    for fila in random.sample(filas, 6):
        fila["fecha"] = random.choice(["31/02/2026", "ayer", "2026-13-45"])   # fechas inválidas
    for fila in random.sample(filas, 10):
        fila["ciudad"] = "  " + fila["ciudad"].upper() + " "                  # espacios y mayúsculas
    filas.extend(random.sample(filas, 7))               # 7 filas duplicadas

    random.shuffle(filas)
    return filas


def main():
    filas = generar_filas()
    with open("ventas.csv", "w", newline="", encoding="utf-8") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=["id", "fecha", "ciudad", "producto", "total"])
        escritor.writeheader()
        escritor.writerows(filas)
    print(f"ventas.csv generado con {len(filas)} filas")


if __name__ == "__main__":
    main()
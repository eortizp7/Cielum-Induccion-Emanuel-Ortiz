import logging
import random
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def medir_tiempo(funcion):
    def envoltorio(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = funcion(*args, **kwargs)
        fin = time.perf_counter()
        logging.info("%s tardó %.4f segundos", funcion.__name__, fin - inicio)
        return resultado
    return envoltorio


CIUDADES = ["Medellín", "Cali", "Bogotá", "Pereira"]


@medir_tiempo
def generar_ventas(cantidad):
    return [
        {"ciudad": random.choice(CIUDADES), "total": random.randint(10000, 500000)}
        for _ in range(cantidad)
    ]


@medir_tiempo
def total_por_ciudad(ventas):
    totales = {}
    for venta in ventas:
        totales[venta["ciudad"]] = totales.get(venta["ciudad"], 0) + venta["total"]
    return totales


@medir_tiempo
def proceso_lento():
    time.sleep(1)      
    return "listo"


ventas = generar_ventas(200_000)
print(total_por_ciudad(ventas))
print(proceso_lento())
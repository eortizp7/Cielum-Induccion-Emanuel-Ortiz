from dataclasses import dataclass

@dataclass
class Producto:
    nombre: str
    precio: float
    stock: int = 0
    stock_minimo: int = 5


class Inventario:
    def __init__(self):
        self.productos = {}      

    def agregar(self, producto):
        if producto.nombre in self.productos:
            self.productos[producto.nombre].stock += producto.stock
        else: 
            self.productos[producto.nombre] = producto

    def descontar(self, nombre, cantidad):
        if nombre not in self.productos: 
            raise KeyError(f"El producto {nombre} no existe")
        elif cantidad > self.productos[nombre].stock:
            raise ValueError(f"No hay suficiente stock")
        else : 
            self.productos[nombre].stock -= cantidad

    def alertas_bajo_stock(self):
        return [p for p in self.productos.values() if p.stock < p.stock_minimo]


# Prueba
inv = Inventario()
inv.agregar(Producto("Taladro", 150000, stock=10))
inv.agregar(Producto("Taladro", 150000, stock=5))
inv.agregar(Producto("Sierra", 320000, stock=6))

print(inv.productos["Taladro"].stock)    # 15: 

inv.descontar("Taladro", 3)
print(inv.productos["Taladro"].stock)    # 12

inv.descontar("Sierra", 2)
print(inv.alertas_bajo_stock())
# [Producto(nombre='Sierra', precio=320000, stock=4, stock_minimo=5)]
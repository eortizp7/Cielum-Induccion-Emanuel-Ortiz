import pytest

from intermedio_inventario import Inventario, Producto


@pytest.fixture
def inventario():
    inv = Inventario()
    inv.agregar(Producto("Taladro", 150000, stock=10))
    return inv


def test_agregar_producto_nuevo(inventario):
    inventario.agregar(Producto("Sierra", 320000, stock=6))
    assert inventario.productos["Sierra"].stock == 6


def test_agregar_producto_existente_suma_stock(inventario):
    inventario.agregar(Producto("Taladro", 150000, stock=5))
    assert inventario.productos["Taladro"].stock == 15


def test_descontar_reduce_stock(inventario):
    inventario.descontar("Taladro", 3)
    assert inventario.productos["Taladro"].stock == 7


def test_descontar_mas_del_stock_lanza_error(inventario):
    with pytest.raises(ValueError):
        inventario.descontar("Taladro", 100)


def test_alerta_bajo_stock(inventario):
    inventario.descontar("Taladro", 6)
    alertas = inventario.alertas_bajo_stock()
    assert len(alertas) == 1
    assert alertas[0].nombre == "Taladro"
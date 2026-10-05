from reporte import calcular_analisis, limpiar_datos


def fila(id_, fecha, ciudad, producto, total):
    return {"id": id_, "fecha": fecha, "ciudad": ciudad, "producto": producto, "total": total}


def test_limpiar_elimina_duplicados():
    filas = [
        fila("1", "2026-01-10", "Cali", "Taladro", "150000"),
        fila("1", "2026-01-10", "Cali", "Taladro", "150000"),
    ]
    assert len(limpiar_datos(filas)) == 1


def test_limpiar_descarta_fechas_y_totales_invalidos():
    filas = [
        fila("1", "ayer", "Cali", "Taladro", "150000"),
        fila("2", "2026-01-10", "Cali", "Taladro", ""),
        fila("3", "2026-01-10", "Cali", "Taladro", "150000"),
    ]
    limpias = limpiar_datos(filas)
    assert len(limpias) == 1
    assert limpias[0]["id"] == "3"


def test_total_por_ciudad_suma_bien_y_normaliza():
    filas = [
        fila("1", "2026-01-10", "  CALI ", "Taladro", "100000"),
        fila("2", "2026-02-10", "Cali", "Sierra", "50000"),
    ]
    _, ciudades, _ = calcular_analisis(limpiar_datos(filas))
    assert ciudades == [("Cali", 150000.0)]
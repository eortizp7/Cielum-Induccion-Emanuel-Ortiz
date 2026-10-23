-- Reto día 6 · Procedimiento registrar_pedido (PostgreSQL / PL/pgSQL)
-- Inserta el pedido y su detalle y descuenta el inventario, todo en una sola transacción.
-- Si un producto no tiene stock suficiente, lanza un error y PostgreSQL deshace TODO (rollback).
--
-- Uso:
--   CALL registrar_pedido(1, '[{"producto_id": 1, "cantidad": 2}, {"producto_id": 9, "cantidad": 3}]', 'nota opcional', NULL);
--   -> devuelve el id del pedido creado en p_pedido_id

CREATE OR REPLACE PROCEDURE registrar_pedido(
    p_cliente_id  INT,
    p_items       JSONB,              -- lista de {producto_id, cantidad}
    p_notas       VARCHAR(255),
    INOUT p_pedido_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_item       RECORD;
    v_precio     DECIMAL(12,2);
    v_disponible INT;
BEGIN
    -- 1. Validaciones de entrada
    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'El pedido debe tener al menos un producto';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM clientes WHERE id = p_cliente_id AND activo) THEN
        RAISE EXCEPTION 'Cliente % no existe o está inactivo', p_cliente_id;
    END IF;

    -- 2. Cabecera del pedido
    INSERT INTO pedidos (cliente_id, notas)
    VALUES (p_cliente_id, p_notas)
    RETURNING id INTO p_pedido_id;

    -- 3. Detalle + descuento de stock.
    --    Se recorren en orden de producto_id para que dos pedidos simultáneos bloqueen las filas
    --    en el mismo orden y no se queden esperándose entre sí (deadlock).
    FOR v_item IN
        SELECT (e ->> 'producto_id')::INT AS producto_id,
               (e ->> 'cantidad')::INT    AS cantidad
        FROM jsonb_array_elements(p_items) AS e
        ORDER BY 1
    LOOP
        IF v_item.cantidad IS NULL OR v_item.cantidad <= 0 THEN
            RAISE EXCEPTION 'Cantidad inválida para el producto %', v_item.producto_id;
        END IF;

        -- Descuenta solo si alcanza: la condición y el descuento son una sola operación
        UPDATE productos
           SET stock = stock - v_item.cantidad
         WHERE id = v_item.producto_id
           AND activo
           AND stock >= v_item.cantidad
        RETURNING precio INTO v_precio;

        IF NOT FOUND THEN
            SELECT stock INTO v_disponible FROM productos WHERE id = v_item.producto_id AND activo;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'El producto % no existe', v_item.producto_id;
            END IF;
            -- Este error aborta la transacción: el pedido y los descuentos anteriores se deshacen
            RAISE EXCEPTION 'Stock insuficiente para el producto % (disponible: %, pedido: %)',
                v_item.producto_id, v_disponible, v_item.cantidad;
        END IF;

        INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (p_pedido_id, v_item.producto_id, v_item.cantidad, v_precio);
    END LOOP;
END;
$$;


-- ===================== Pruebas =====================
-- Caso OK: se crea el pedido y baja el stock de los productos 1 y 9
CALL registrar_pedido(1, '[{"producto_id": 1, "cantidad": 2}, {"producto_id": 9, "cantidad": 3}]', 'Prueba OK', NULL);

SELECT p.id, p.cliente_id, p.estado, t.total
FROM pedidos p JOIN v_pedido_totales t ON t.pedido_id = p.id
ORDER BY p.id DESC LIMIT 1;

-- Caso ROLLBACK: el producto 4 tiene stock 0. El error deshace TODO,
-- incluido el descuento del producto 1 que se había hecho antes en el mismo CALL.
SELECT id, stock FROM productos WHERE id IN (1, 4) ORDER BY id;   -- stock antes
-- CALL registrar_pedido(2, '[{"producto_id": 1, "cantidad": 1}, {"producto_id": 4, "cantidad": 1}]', 'Debe fallar', NULL);
--   ERROR:  Stock insuficiente para el producto 4 (disponible: 0, pedido: 1)
SELECT id, stock FROM productos WHERE id IN (1, 4) ORDER BY id;   -- stock después: igual que antes

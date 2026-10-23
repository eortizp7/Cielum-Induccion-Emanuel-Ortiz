-- Reto día 6 · Procedimiento registrar_pedido (SQL Server / T-SQL)
-- Inserta el pedido y su detalle y descuenta el inventario dentro de una transacción explícita.
-- Si un producto no tiene stock suficiente, hace ROLLBACK y relanza el error.
--
-- Uso:
--   DECLARE @id INT;
--   EXEC registrar_pedido @cliente_id = 1,
--        @items = N'[{"producto_id": 1, "cantidad": 2}, {"producto_id": 9, "cantidad": 3}]',
--        @notas = 'nota opcional', @pedido_id = @id OUTPUT;
--   SELECT @id;
-- Requiere SQL Server 2016 o superior (OPENJSON). El contenedor del proyecto usa 2022.

USE tienda;
GO

CREATE OR ALTER PROCEDURE registrar_pedido
    @cliente_id INT,
    @items      NVARCHAR(MAX),          -- lista JSON de {producto_id, cantidad}
    @notas      VARCHAR(255) = NULL,
    @pedido_id  INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;   -- ante cualquier error grave, SQL Server marca la transacción para deshacerla

    DECLARE @producto_id INT, @cantidad INT, @precio DECIMAL(12,2), @disponible INT, @mensaje NVARCHAR(200);

    BEGIN TRY
        -- 1. Validaciones de entrada
        IF @items IS NULL OR ISJSON(@items) = 0
        BEGIN
            THROW 50001, 'El pedido debe tener al menos un producto', 1;
        END;
        IF NOT EXISTS (SELECT 1 FROM OPENJSON(@items))
        BEGIN
            THROW 50001, 'El pedido debe tener al menos un producto', 1;
        END;

        IF NOT EXISTS (SELECT 1 FROM clientes WHERE id = @cliente_id AND activo = 1)
        BEGIN
            SET @mensaje = CONCAT('Cliente ', @cliente_id, ' no existe o está inactivo');
            THROW 50002, @mensaje, 1;
        END;

        BEGIN TRANSACTION;

        -- 2. Cabecera del pedido
        INSERT INTO pedidos (cliente_id, notas) VALUES (@cliente_id, @notas);
        SET @pedido_id = SCOPE_IDENTITY();

        -- 3. Detalle + descuento de stock, en orden de producto_id (evita bloqueos cruzados)
        DECLARE items_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT producto_id, cantidad
            FROM OPENJSON(@items) WITH (producto_id INT '$.producto_id', cantidad INT '$.cantidad')
            ORDER BY producto_id;

        OPEN items_cursor;
        FETCH NEXT FROM items_cursor INTO @producto_id, @cantidad;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF @cantidad IS NULL OR @cantidad <= 0
            BEGIN
                SET @mensaje = CONCAT('Cantidad inválida para el producto ', @producto_id);
                THROW 50003, @mensaje, 1;
            END;

            -- Descuenta solo si alcanza (condición y descuento en una sola operación) y guarda el precio
            UPDATE productos
               SET @precio = precio,
                   stock   = stock - @cantidad
             WHERE id = @producto_id AND activo = 1 AND stock >= @cantidad;

            IF @@ROWCOUNT = 0
            BEGIN
                SELECT @disponible = stock FROM productos WHERE id = @producto_id AND activo = 1;
                IF @@ROWCOUNT = 0
                    SET @mensaje = CONCAT('El producto ', @producto_id, ' no existe');
                ELSE
                    SET @mensaje = CONCAT('Stock insuficiente para el producto ', @producto_id,
                                          ' (disponible: ', @disponible, ', pedido: ', @cantidad, ')');
                THROW 50004, @mensaje, 1;    -- salta al CATCH, que hace el ROLLBACK
            END;

            INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
            VALUES (@pedido_id, @producto_id, @cantidad, @precio);

            FETCH NEXT FROM items_cursor INTO @producto_id, @cantidad;
        END;

        CLOSE items_cursor;
        DEALLOCATE items_cursor;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;   -- deshace pedido, detalle y descuentos
        SET @pedido_id = NULL;
        THROW;                                     -- relanza el error original a quien llamó
    END CATCH;
END;
GO


-- ===================== Pruebas =====================
-- Caso OK
DECLARE @nuevo INT;
EXEC registrar_pedido @cliente_id = 1,
     @items = N'[{"producto_id": 1, "cantidad": 2}, {"producto_id": 9, "cantidad": 3}]',
     @notas = 'Prueba OK', @pedido_id = @nuevo OUTPUT;
SELECT @nuevo AS pedido_creado;
SELECT * FROM v_pedido_totales WHERE pedido_id = @nuevo;
GO

-- Caso ROLLBACK: el producto 4 tiene stock 0. El stock del producto 1 no debe cambiar.
SELECT id, stock FROM productos WHERE id IN (1, 4) ORDER BY id;   -- antes
DECLARE @fallido INT;
BEGIN TRY
    EXEC registrar_pedido @cliente_id = 2,
         @items = N'[{"producto_id": 1, "cantidad": 1}, {"producto_id": 4, "cantidad": 1}]',
         @notas = 'Debe fallar', @pedido_id = @fallido OUTPUT;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS numero, ERROR_MESSAGE() AS mensaje;  -- 50004, Stock insuficiente...
END CATCH;
SELECT id, stock FROM productos WHERE id IN (1, 4) ORDER BY id;   -- después: igual que antes
GO

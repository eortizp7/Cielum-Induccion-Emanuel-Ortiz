CREATE DATABASE tienda;
GO
USE tienda;
GO

CREATE TABLE categorias (
  id     INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE clientes (
  id        INT IDENTITY(1,1) PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(120) NOT NULL UNIQUE,
  telefono  VARCHAR(20) NULL,
  ciudad    VARCHAR(60) NULL,
  activo    BIT NOT NULL DEFAULT 1,
  creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE productos (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  categoria_id INT NOT NULL REFERENCES categorias(id),
  sku          VARCHAR(30) NOT NULL UNIQUE,
  nombre       VARCHAR(120) NOT NULL,
  precio       DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
  stock        INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  activo       BIT NOT NULL DEFAULT 1,
  creado_en    DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE pedidos (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  cliente_id   INT NOT NULL REFERENCES clientes(id),
  fecha_pedido DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  estado       VARCHAR(15) NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pendiente','pagado','enviado','entregado','cancelado')),
  notas        VARCHAR(255) NULL
);

CREATE TABLE detalle_pedido (
  id              INT IDENTITY(1,1) PRIMARY KEY,
  pedido_id       INT NOT NULL REFERENCES pedidos(id),
  producto_id     INT NOT NULL REFERENCES productos(id),
  cantidad        INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
  UNIQUE (pedido_id, producto_id)
);
GO

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_pedidos_cliente     ON pedidos(cliente_id);
CREATE INDEX idx_detalle_producto    ON detalle_pedido(producto_id);
GO

-- Total por pedido: se calcula, nunca se guarda
CREATE VIEW v_pedido_totales AS
SELECT p.id AS pedido_id, p.cliente_id, p.estado,
       SUM(d.cantidad * d.precio_unitario) AS total
FROM pedidos p
JOIN detalle_pedido d ON d.pedido_id = p.id
GROUP BY p.id, p.cliente_id, p.estado;
GO
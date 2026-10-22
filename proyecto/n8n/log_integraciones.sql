-- Registro de lo que hacen las integraciones (n8n -> Zoho): una fila por intento.
-- Se crea sola en una base nueva (docker-compose la monta en initdb.d).
-- Si la base ya existía, se aplica a mano una vez (ver proyecto/n8n/README.md).
CREATE TABLE IF NOT EXISTS log_integraciones (
  id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pedido_id INT,  -- sin clave foránea a propósito: un log nunca debe fallar por integridad (también registra rechazos)
  sistema   VARCHAR(30) NOT NULL,
  accion    VARCHAR(30) NOT NULL,
  estado    VARCHAR(10) NOT NULL CHECK (estado IN ('ok', 'error', 'rechazado')),
  detalle   TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_log_integraciones_pedido ON log_integraciones(pedido_id);

-- Idempotencia: un pedido solo puede quedar "ok" una vez por sistema.
-- Si n8n reintenta un pedido que ya se sincronizó, el INSERT choca con este índice y no duplica el log.
CREATE UNIQUE INDEX IF NOT EXISTS uq_log_integraciones_ok
  ON log_integraciones(pedido_id, sistema) WHERE estado = 'ok';

require('dotenv').config();
const { Pool, types } = require('pg');

// timestamp sin zona (tipo 1114): el servidor guarda en UTC, se lee como UTC
types.setTypeParser(1114, (valor) => new Date(valor + 'Z'));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
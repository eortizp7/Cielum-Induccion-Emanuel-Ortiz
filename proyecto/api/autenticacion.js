const USUARIO = { usuario: 'admin', clave: 'admin123' };
const TOKEN = 'token-de-prueba-123';

function requiereToken(req, res, next) {
  const cabecera = req.headers.authorization || '';
  if (cabecera !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'Token faltante o inválido' });
  }
  next();
}

module.exports = { USUARIO, TOKEN, requiereToken };
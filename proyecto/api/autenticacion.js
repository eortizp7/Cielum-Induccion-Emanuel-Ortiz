const jwt = require('jsonwebtoken');

function crearToken(usuario) {
  return jwt.sign({ usuario }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRA || '1h',
  });
}

function requiereToken(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token faltante o inválido' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    const mensaje = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token faltante o inválido';
    res.status(401).json({ error: mensaje });
  }
}

module.exports = { crearToken, requiereToken };
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token

  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token no válido' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;


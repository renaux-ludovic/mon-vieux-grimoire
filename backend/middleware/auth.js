const jwt = require('jsonwebtoken');

function extractToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]; 
  if (token) {
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      req.auth = decoded;
      next(); 
    });
  } else {
    return res.status(401).json({ message: 'Token manquant' });
  }
}

module.exports = extractToken;

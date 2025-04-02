const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado, no se encontró el token.' });
  }

  const token = authHeader.split(' ')[1]; // Separa "Bearer" del token
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no válido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // El payload decodificado del token se asigna a req.user
    console.log("Decoded token:", decoded);  
    next();
  } catch (err) {
    console.error("Token invalid:", err);
    res.status(400).json({ message: 'Token no válido' });
  }
};


module.exports = { verifyToken };

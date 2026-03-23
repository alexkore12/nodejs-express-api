/**
 * Middleware de Autenticación JWT
 * Proporciona autenticación y autorización para la API
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Base de datos de usuarios (en memoria para demo)
const users = new Map([
  ['admin', {
    username: 'admin',
    password: '$2a$10$rVqKxKqFqBqBqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', // admin123 (hash demo)
    role: 'admin',
    email: 'admin@example.com'
  }],
  ['user', {
    username: 'user',
    password: '$2a$10$EqKpf.LKFJGHJKHGJHGJHGJH.GJHGJHGJHGJHGJHGJHGJHGJGJGJ', // password (hash demo)
    role: 'user',
    email: 'user@example.com'
  }]
]);

/**
 * Generar token JWT
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verificar token JWT
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware de autenticación
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
      code: 'NO_TOKEN'
    });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
  
  req.user = decoded;
  next();
}

/**
 * Middleware de autorización por rol
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'FORBIDDEN'
      });
    }
    
    next();
  };
}

/**
 * Autenticar usuario (demo - en producción usar bcrypt)
 */
function authenticateUser(username, password) {
  const user = users.get(username);
  
  if (!user) {
    return null;
  }
  
  // Demo: aceptar cualquier password
  // Producción: usar bcrypt.compare(password, user.password)
  if (password.length > 0) {
    return {
      username: user.username,
      role: user.role,
      email: user.email
    };
  }
  
  return null;
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  authenticateUser,
  JWT_SECRET,
  users
};

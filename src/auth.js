/**
 * JWT Authentication Module
 * Versión 2.0 - Token based authentication
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key from environment or default (change in production!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '30m';

// In-memory user store (replace with database in production)
const users = new Map([
  ['admin', {
    username: 'admin',
    password: '$2a$10$xXvZ.1.O5.4.y5.Z5.Y6.Z7.Y8.Y9.Z0.Z1.Z2.Z3.Z4.Z5.Z6.Z7.Z8', // admin123
    role: 'admin'
  }],
  ['user', {
    username: 'user',
    password: '$2a$10$xXvZ.1.O5.4.y5.Z5.Y6.Z7.Y8.Y9.Z0.Z1.Z2.Z3.Z4.Z5.Z6.Z7.Z8', // password
    role: 'user'
  }]
]);

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - Match result
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {object} user - User object
 * @returns {string} - JWT token
 */
function generateToken(user) {
  const payload = {
    username: user.username,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token or null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Authentication middleware
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
  
  req.user = decoded;
  next();
}

/**
 * Role-based access control middleware
 * @param {string[]} roles - Allowed roles
 * @returns {function} - Middleware function
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
}

/**
 * Login handler
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function login(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Username and password required'
    });
  }
  
  const user = users.get(username);
  
  if (!user) {
    // For demo, allow any login with auto-created user
    const newUser = {
      username,
      password: await hashPassword(password),
      role: 'user'
    };
    users.set(username, newUser);
    
    const token = generateToken(newUser);
    return res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 1800
    });
  }
  
  const valid = await comparePassword(password, user.password);
  
  if (!valid) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
  }
  
  const token = generateToken(user);
  
  res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 1800
  });
}

/**
 * Get current user info
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function getMe(req, res) {
  res.json({
    username: req.user.username,
    role: req.user.role
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  login,
  getMe,
  JWT_SECRET,
  JWT_EXPIRY
};

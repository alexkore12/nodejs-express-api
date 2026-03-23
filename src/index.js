const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');
const { securityHeadersMiddleware, requestIdMiddleware } = require('./middleware/security');
const { login, getMe, authenticate } = require('./auth');
const { getHealthStatus, deepHealthCheck } = require('./healthcheck');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate Limiter configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10, // 10 requests per minute for auth
  message: {
    error: 'Too Many Requests',
    message: 'Too many login attempts. Please try again later.'
  }
});

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(securityHeadersMiddleware);
app.use(requestIdMiddleware);

// Apply rate limiting
app.use(limiter);

// Parseo de JSON
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoints (públicos)
app.get('/health', (req, res) => {
  const health = getHealthStatus();
  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

app.get('/health/ready', async (req, res) => {
  const health = await deepHealthCheck();
  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

// Auth endpoints (with stricter rate limiting)
app.post('/auth/login', authLimiter, login);
app.get('/auth/me', authenticate, getMe);

// Protected API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Authentication: Enabled`);
  console.log(`🛡️ Rate Limiting: Enabled (100 req/min)`);
});

module.exports = app;

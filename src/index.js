/**
 * Node.js Express API - Entry Point
 * Versión mejorada con seguridad y logging avanzado
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const uuid = require('uuid');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuid.v4().slice(0, 8);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Logging
const logger = require('./middleware/logger');

// Rate limiting - protección contra DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: { 
    error: 'Too many requests', 
    retry: 'Try again in 15 minutes' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configurable
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-ID'],
  credentials: true,
  maxAge: 86400, // 24 horas
};

app.use(cors(corsOptions));

// Logging de requests
app.use(morgan('combined'));

// Rate limiting
app.use('/api', limiter);

// Parseo de JSON con límite de tamaño
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    uptime_formatted: formatUptime(uptime),
    version: '1.1.0',
    environment: NODE_ENV,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    }
  });
});

// Rutas
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - ${req.method} ${req.url} - Request ID: ${req.id}`);
  res.status(404).json({ 
    error: 'Not found',
    requestId: req.id,
    path: req.url
  });
});

// Error handler
app.use(errorHandler);

// Función para formatear uptime
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═'.repeat(40));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${NODE_ENV}`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log('═'.repeat(40));
});

module.exports = app;

/**
 * Middleware de manejo de errores
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Error de Joi/validación
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(d => d.message)
    });
  }
  
  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: 'Invalid JSON'
    });
  }
  
  // Error por defecto
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };

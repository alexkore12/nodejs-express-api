/**
 * Security Middleware
 * Enhanced security headers and protections
 */

const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // XSS Protection
  'X-XSS-Protection': '1; mode=block',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Content Security Policy
  'Content-Security-Policy': "default-src 'self'",
  // Permissions Policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

/**
 * Apply security headers to all responses
 */
const securityHeadersMiddleware = (req, res, next) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
};

/**
 * Request ID middleware for tracing
 */
const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || require('uuid').v4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

module.exports = {
  securityHeadersMiddleware,
  requestIdMiddleware,
  securityHeaders
};

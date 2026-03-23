/**
 * Rate Limiter Middleware for Express
 * Simple in-memory rate limiter with sliding window
 */
const rateLimitStore = new Map();

function rateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute window
    max = 100, // max requests per window
    keyFn = (req) => req.ip,
    handler = (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  } = options;

  return (req, res, next) => {
    const key = keyFn(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create window data
    let windowData = rateLimitStore.get(key);
    if (!windowData || windowData.start < windowStart) {
      windowData = { start: now, count: 0 };
    }

    windowData.count++;
    rateLimitStore.set(key, windowData);

    // Set rate limit headers
    res.set('X-RateLimit-Limit', max);
    res.set('X-RateLimit-Remaining', Math.max(0, max - windowData.count));
    res.set('X-RateLimit-Reset', Math.ceil(windowData.start / 1000));

    if (windowData.count > max) {
      return handler(req, res);
    }

    next();
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore) {
    if (data.start < now - 5 * 60 * 1000) { // 5 min stale
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

module.exports = rateLimiter;

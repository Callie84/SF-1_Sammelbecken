const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Limit pro IP
  message: { error: 'Zu viele Anfragen, bitte später erneut versuchen' }
});

module.exports = apiLimiter;
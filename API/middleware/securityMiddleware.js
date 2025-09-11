const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

module.exports = (app) => {
  app.use(helmet());
  app.use(xss());
  app.use(mongoSanitize());
};
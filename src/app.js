require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const { sessionConfig } = require('./config/session');
const swaggerSpec = require('./config/swagger');
const logger = require('./config/logger');
const routes = require('./routes');
const { generateCsrfToken } = require('./middlewares/csrf.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const { apiLimiter } = require('./middlewares/rate-limit.middleware');

const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * CORS configuration
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  })
);

/**
 * Body parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * HTTP request logger
 */
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

/**
 * Session configuration
 */
app.use(session(sessionConfig));

/**
 * CSRF token generation
 */
app.use(generateCsrfToken);

/**
 * Rate limiting
 */
app.use('/api', apiLimiter);

/**
 * API Documentation
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'LMS Backend API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

/**
 * 404 handler
 */
app.use(notFoundHandler);

/**
 * Global error handler
 */
app.use(errorHandler);

module.exports = app;

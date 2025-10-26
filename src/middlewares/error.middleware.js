const logger = require('../config/logger');
const ResponseUtil = require('../utils/response.util');
const { ERROR_CODES, HTTP_STATUS } = require('../config/constants');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle specific error codes
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';

  if (err.message === ERROR_CODES.NOT_FOUND) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorCode = ERROR_CODES.NOT_FOUND;
    message = 'Resource not found';
  } else if (err.message === ERROR_CODES.CONFLICT) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = ERROR_CODES.CONFLICT;
    message = 'Resource already exists';
  } else if (err.message === ERROR_CODES.INVALID_CREDENTIALS) {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorCode = ERROR_CODES.INVALID_CREDENTIALS;
    message = 'Invalid credentials';
  } else if (err.message === ERROR_CODES.UNAUTHORIZED) {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorCode = ERROR_CODES.UNAUTHORIZED;
    message = 'Unauthorized access';
  } else if (err.message === ERROR_CODES.FORBIDDEN) {
    statusCode = HTTP_STATUS.FORBIDDEN;
    errorCode = ERROR_CODES.FORBIDDEN;
    message = 'Access forbidden';
  } else if (err.message === ERROR_CODES.ALREADY_ENROLLED) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = ERROR_CODES.ALREADY_ENROLLED;
    message = 'Already enrolled in this course';
  } else if (err.message) {
    message = err.message;
  }

  return ResponseUtil.error(res, errorCode, message, statusCode, [], req.path);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  return ResponseUtil.error(
    res,
    ERROR_CODES.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND,
    [],
    req.path
  );
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

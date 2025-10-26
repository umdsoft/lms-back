const { HTTP_STATUS } = require('../config/constants');

/**
 * Standardized API response utility
 */
class ResponseUtil {
  /**
   * Send success response
   * @param {object} res - Express response object
   * @param {object} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  static success(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    const response = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated success response
   * @param {object} res - Express response object
   * @param {object} data - Response data
   * @param {object} pagination - Pagination info
   * @param {string} message - Success message
   */
  static successWithPagination(res, data, pagination, message = 'Success') {
    const response = {
      success: true,
      message,
      data,
      pagination,
    };

    return res.status(HTTP_STATUS.OK).json(response);
  }

  /**
   * Send error response
   * @param {object} res - Express response object
   * @param {string} errorCode - Error code
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {array} details - Error details
   * @param {string} path - Request path
   */
  static error(
    res,
    errorCode,
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details = [],
    path = ''
  ) {
    const response = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details.length > 0 && { details }),
      },
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   * @param {object} res - Express response object
   * @param {array} errors - Validation errors
   */
  static validationError(res, errors) {
    return this.error(
      res,
      'VALIDATION_ERROR',
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  /**
   * Send unauthorized error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 'UNAUTHORIZED', message, HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send forbidden error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, 'FORBIDDEN', message, HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send not found error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 'NOT_FOUND', message, HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Send conflict error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, 'CONFLICT', message, HTTP_STATUS.CONFLICT);
  }
}

module.exports = ResponseUtil;

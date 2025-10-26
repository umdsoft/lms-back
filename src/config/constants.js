/**
 * Application-wide constants
 */

/**
 * Error codes
 */
const ERROR_CODES = {
  // Client Errors (400-499)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',

  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',

  // Server Errors (500-599)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Business Logic Errors
  COURSE_FULL: 'COURSE_FULL',
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED',
  QUIZ_ATTEMPTS_EXCEEDED: 'QUIZ_ATTEMPTS_EXCEEDED',
  ASSIGNMENT_LATE: 'ASSIGNMENT_LATE',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Pagination defaults
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * File upload constants
 */
const FILE_UPLOAD = {
  MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
};

/**
 * Rate limiting constants
 */
const RATE_LIMIT = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  AUTH_MAX_REQUESTS: 5, // 5 attempts per 15 minutes for auth endpoints
  UPLOAD_MAX_REQUESTS: 10, // 10 uploads per hour
};

/**
 * Supported languages
 */
const LANGUAGES = {
  UZBEK: 'uz',
  RUSSIAN: 'ru',
  ENGLISH: 'en',
};

/**
 * Default values
 */
const DEFAULTS = {
  LANGUAGE: LANGUAGES.UZBEK,
  ROLE: 'STUDENT',
  USER_STATUS: 'ACTIVE',
  COURSE_STATUS: 'DRAFT',
  QUIZ_PASSING_SCORE: 70,
  MAX_QUIZ_ATTEMPTS: 3,
};

module.exports = {
  ERROR_CODES,
  HTTP_STATUS,
  PAGINATION,
  FILE_UPLOAD,
  RATE_LIMIT,
  LANGUAGES,
  DEFAULTS,
};

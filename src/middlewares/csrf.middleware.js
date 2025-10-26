const TokenUtil = require('../utils/token.util');
const ResponseUtil = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Generate CSRF token and attach to session
 */
const generateCsrfToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = TokenUtil.generateCsrfToken();
  }
  next();
};

/**
 * Validate CSRF token from request header
 */
const validateCsrfToken = (req, res, next) => {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const sessionToken = req.session?.csrfToken;
  const requestToken = req.headers['x-csrf-token'];

  if (!TokenUtil.validateCsrfToken(sessionToken, requestToken)) {
    return ResponseUtil.error(
      res,
      'CSRF_TOKEN_INVALID',
      'Invalid or missing CSRF token',
      HTTP_STATUS.FORBIDDEN
    );
  }

  next();
};

module.exports = {
  generateCsrfToken,
  validateCsrfToken,
};

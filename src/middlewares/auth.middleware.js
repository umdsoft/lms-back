const ResponseUtil = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Authentication middleware
 * Checks if user is authenticated via session
 */
const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return ResponseUtil.error(
      res,
      'UNAUTHORIZED',
      'Authentication required',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Attach user to request object
  req.user = req.session.user;
  next();
};

/**
 * Optional authentication middleware
 * Attaches user to request if authenticated, but doesn't require it
 */
const optionalAuthenticate = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};

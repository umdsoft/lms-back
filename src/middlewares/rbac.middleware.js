const ResponseUtil = require('../utils/response.util');
const { hasPermission } = require('../constants/permissions');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Role-based access control middleware
 * @param {array} allowedRoles - Array of allowed roles
 * @returns {function} Express middleware
 */
const rbac = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseUtil.error(
        res,
        'UNAUTHORIZED',
        'Authentication required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return ResponseUtil.error(
        res,
        'FORBIDDEN',
        'Insufficient permissions',
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };
};

/**
 * Permission-based access control middleware
 * @param {string} permission - Required permission
 * @returns {function} Express middleware
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseUtil.error(
        res,
        'UNAUTHORIZED',
        'Authentication required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!hasPermission(req.user.role, permission)) {
      return ResponseUtil.error(
        res,
        'FORBIDDEN',
        'Insufficient permissions',
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };
};

module.exports = {
  rbac,
  checkPermission,
};

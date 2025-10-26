const crypto = require('crypto');

/**
 * Token utility for CSRF token generation and validation
 */
class TokenUtil {
  /**
   * Generate CSRF token
   * @returns {string} Random CSRF token
   */
  static generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate random token
   * @param {number} length - Token length in bytes
   * @returns {string} Random token
   */
  static generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Validate CSRF token
   * @param {string} sessionToken - Token from session
   * @param {string} requestToken - Token from request
   * @returns {boolean} True if tokens match
   */
  static validateCsrfToken(sessionToken, requestToken) {
    if (!sessionToken || !requestToken) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(sessionToken),
      Buffer.from(requestToken)
    );
  }
}

module.exports = TokenUtil;

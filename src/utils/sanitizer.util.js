const sanitizeHtml = require('sanitize-html');

/**
 * Input sanitization utility
 */
class SanitizerUtil {
  /**
   * Sanitize HTML content
   * @param {string} html - HTML content
   * @param {object} options - Sanitization options
   * @returns {string} Sanitized HTML
   */
  static sanitizeHtml(html, options = {}) {
    const defaultOptions = {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'a',
        'p',
        'br',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'code',
        'pre',
      ],
      allowedAttributes: {
        a: ['href', 'target'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
    };

    return sanitizeHtml(html, { ...defaultOptions, ...options });
  }

  /**
   * Sanitize plain text (strip all HTML)
   * @param {string} text - Text content
   * @returns {string} Sanitized text
   */
  static sanitizeText(text) {
    return sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }

  /**
   * Escape special characters for SQL LIKE queries
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeLike(text) {
    return text.replace(/[%_\\]/g, '\\$&');
  }
}

module.exports = SanitizerUtil;

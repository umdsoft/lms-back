const { PAGINATION } = require('../config/constants');

/**
 * Pagination utility
 */
class PaginationUtil {
  /**
   * Get pagination parameters from request
   * @param {object} query - Request query params
   * @returns {object} Pagination parameters
   */
  static getPaginationParams(query) {
    const page = Math.max(
      parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE,
      1
    );
    const limit = Math.min(
      Math.max(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
      PAGINATION.MAX_LIMIT
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Build pagination response
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items count
   * @returns {object} Pagination info
   */
  static buildPaginationResponse(page, limit, total) {
    const pages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      pages,
      hasNextPage: page < pages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Apply pagination to Knex query
   * @param {object} query - Knex query builder
   * @param {number} limit - Items per page
   * @param {number} offset - Offset
   * @returns {object} Modified query
   */
  static applyPagination(query, limit, offset) {
    return query.limit(limit).offset(offset);
  }
}

module.exports = PaginationUtil;

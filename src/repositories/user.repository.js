const BaseRepository = require('./base.repository');

/**
 * User repository
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} User or null
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Find user by email (including soft deleted)
   * @param {string} email - User email
   * @returns {Promise<object|null>} User or null
   */
  async findByEmailWithDeleted(email) {
    return this.db(this.tableName).where({ email }).first();
  }

  /**
   * Find active users
   * @param {object} filters - Additional filters
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of users
   */
  async findActiveUsers(filters = {}, options = {}) {
    return this.findAll(
      { ...filters, status: 'ACTIVE', deleted_at: null },
      options
    );
  }

  /**
   * Update last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of affected rows
   */
  async updateLastLogin(userId) {
    return this.db(this.tableName)
      .where({ id: userId })
      .update({ last_login_at: this.db.fn.now() });
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of users
   */
  async findByRole(role, options = {}) {
    return this.findAll({ role, deleted_at: null }, options);
  }
}

module.exports = new UserRepository();

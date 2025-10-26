const db = require('../database/knex');

/**
 * Base repository class implementing common database operations
 */
class BaseRepository {
  /**
   * @param {string} tableName - Database table name
   */
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Find all records with optional filters
   * @param {object} filters - Filter conditions
   * @param {object} options - Query options (select, orderBy, limit, offset)
   * @returns {Promise<array>} Array of records
   */
  async findAll(filters = {}, options = {}) {
    let query = this.db(this.tableName).where(filters);

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || 'asc');
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    return query;
  }

  /**
   * Find a single record by ID
   * @param {number} id - Record ID
   * @returns {Promise<object|null>} Record or null
   */
  async findById(id) {
    return this.db(this.tableName).where({ id }).first();
  }

  /**
   * Find a single record by filters
   * @param {object} filters - Filter conditions
   * @returns {Promise<object|null>} Record or null
   */
  async findOne(filters) {
    return this.db(this.tableName).where(filters).first();
  }

  /**
   * Create a new record
   * @param {object} data - Record data
   * @returns {Promise<number>} Inserted record ID
   */
  async create(data) {
    const [id] = await this.db(this.tableName).insert(data);
    return id;
  }

  /**
   * Update a record by ID
   * @param {number} id - Record ID
   * @param {object} data - Updated data
   * @returns {Promise<number>} Number of affected rows
   */
  async update(id, data) {
    return this.db(this.tableName)
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() });
  }

  /**
   * Delete a record by ID (hard delete)
   * @param {number} id - Record ID
   * @returns {Promise<number>} Number of affected rows
   */
  async delete(id) {
    return this.db(this.tableName).where({ id }).del();
  }

  /**
   * Soft delete a record by ID
   * @param {number} id - Record ID
   * @returns {Promise<number>} Number of affected rows
   */
  async softDelete(id) {
    return this.db(this.tableName)
      .where({ id })
      .update({ deleted_at: this.db.fn.now() });
  }

  /**
   * Count records with optional filters
   * @param {object} filters - Filter conditions
   * @returns {Promise<number>} Count of records
   */
  async count(filters = {}) {
    const result = await this.db(this.tableName)
      .where(filters)
      .count('* as count')
      .first();
    return result.count;
  }

  /**
   * Check if a record exists
   * @param {object} filters - Filter conditions
   * @returns {Promise<boolean>} True if exists
   */
  async exists(filters) {
    const count = await this.count(filters);
    return count > 0;
  }
}

module.exports = BaseRepository;

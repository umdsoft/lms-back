const BaseRepository = require('./base.repository');

class OlympiadRepository extends BaseRepository {
  constructor() {
    super('olympiads');
  }

  /**
   * Find all olympiads with filters
   * @param {object} filters - Filter options
   * @returns {Promise<array>} Array of olympiads
   */
  async findAllWithFilters(filters = {}) {
    let query = this.db(this.tableName);

    if (filters.subject) {
      query = query.where({ subject: filters.subject });
    }

    if (filters.level) {
      query = query.where({ level: filters.level });
    }

    if (filters.status) {
      query = query.where({ status: filters.status });
    }

    if (filters.upcoming) {
      query = query.where('start_date', '>', this.db.fn.now());
    }

    return query.orderBy('start_date', 'asc');
  }

  /**
   * Find olympiads by status
   * @param {string} status - Olympiad status
   * @returns {Promise<array>} Array of olympiads
   */
  async findByStatus(status) {
    return this.db(this.tableName)
      .where({ status })
      .orderBy('start_date', 'asc');
  }

  /**
   * Get upcoming olympiads
   * @returns {Promise<array>} Array of upcoming olympiads
   */
  async getUpcoming() {
    return this.db(this.tableName)
      .where('start_date', '>', this.db.fn.now())
      .whereIn('status', ['UPCOMING', 'REGISTRATION_OPEN'])
      .orderBy('start_date', 'asc');
  }

  /**
   * Get active olympiads (registration open or in progress)
   * @returns {Promise<array>} Array of active olympiads
   */
  async getActive() {
    return this.db(this.tableName)
      .whereIn('status', ['REGISTRATION_OPEN', 'IN_PROGRESS'])
      .orderBy('start_date', 'asc');
  }

  /**
   * Get olympiads with participant count
   * @returns {Promise<array>} Array of olympiads with participant count
   */
  async findAllWithParticipantCount() {
    return this.db(this.tableName)
      .select('olympiads.*')
      .count('olympiad_registrations.id as participant_count')
      .leftJoin('olympiad_registrations', 'olympiads.id', 'olympiad_registrations.olympiad_id')
      .groupBy('olympiads.id')
      .orderBy('olympiads.start_date', 'desc');
  }

  /**
   * Get olympiad with participant count
   * @param {number} id - Olympiad ID
   * @returns {Promise<object|null>} Olympiad with participant count
   */
  async findByIdWithParticipantCount(id) {
    return this.db(this.tableName)
      .select('olympiads.*')
      .count('olympiad_registrations.id as participant_count')
      .leftJoin('olympiad_registrations', 'olympiads.id', 'olympiad_registrations.olympiad_id')
      .where('olympiads.id', id)
      .groupBy('olympiads.id')
      .first();
  }
}

module.exports = new OlympiadRepository();

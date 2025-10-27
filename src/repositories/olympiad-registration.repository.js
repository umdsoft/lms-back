const BaseRepository = require('./base.repository');

class OlympiadRegistrationRepository extends BaseRepository {
  constructor() {
    super('olympiad_registrations');
  }

  /**
   * Find registration by user and olympiad
   * @param {number} userId - User ID
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<object|null>} Registration
   */
  async findByUserAndOlympiad(userId, olympiadId) {
    return this.db(this.tableName)
      .where({ user_id: userId, olympiad_id: olympiadId })
      .first();
  }

  /**
   * Find all registrations for a user
   * @param {number} userId - User ID
   * @returns {Promise<array>} Array of registrations with olympiad details
   */
  async findByUser(userId) {
    return this.db(this.tableName)
      .select(
        'olympiad_registrations.*',
        'olympiads.title as olympiad_title',
        'olympiads.subject',
        'olympiads.level',
        'olympiads.start_date',
        'olympiads.end_date',
        'olympiads.status as olympiad_status'
      )
      .join('olympiads', 'olympiad_registrations.olympiad_id', 'olympiads.id')
      .where('olympiad_registrations.user_id', userId)
      .orderBy('olympiads.start_date', 'desc');
  }

  /**
   * Find all registrations for an olympiad
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<array>} Array of registrations with user details
   */
  async findByOlympiad(olympiadId) {
    return this.db(this.tableName)
      .select(
        'olympiad_registrations.*',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.phone'
      )
      .join('users', 'olympiad_registrations.user_id', 'users.id')
      .where('olympiad_registrations.olympiad_id', olympiadId)
      .orderBy('olympiad_registrations.registered_at', 'asc');
  }

  /**
   * Get leaderboard for an olympiad
   * @param {number} olympiadId - Olympiad ID
   * @param {number} limit - Limit results
   * @returns {Promise<array>} Sorted leaderboard
   */
  async getLeaderboard(olympiadId, limit = 100) {
    return this.db(this.tableName)
      .select(
        'olympiad_registrations.*',
        'users.first_name',
        'users.last_name'
      )
      .join('users', 'olympiad_registrations.user_id', 'users.id')
      .where('olympiad_registrations.olympiad_id', olympiadId)
      .whereNotNull('olympiad_registrations.score')
      .orderBy('olympiad_registrations.score', 'desc')
      .limit(limit);
  }

  /**
   * Count registrations for an olympiad
   * @param {number} olympiadId - Olympiad ID
   * @returns {Promise<number>} Count of registrations
   */
  async countByOlympiad(olympiadId) {
    const result = await this.db(this.tableName)
      .where({ olympiad_id: olympiadId })
      .count('* as count')
      .first();
    return result.count;
  }

  /**
   * Update participant rank
   * @param {number} id - Registration ID
   * @param {number} rank - Rank
   * @returns {Promise<number>} Number of affected rows
   */
  async updateRank(id, rank) {
    return this.update(id, { rank });
  }

  /**
   * Update participant score
   * @param {number} id - Registration ID
   * @param {number} score - Score
   * @returns {Promise<number>} Number of affected rows
   */
  async updateScore(id, score) {
    return this.update(id, { score, status: 'PARTICIPATED' });
  }
}

module.exports = new OlympiadRegistrationRepository();

const BaseRepository = require('./base.repository');

class QuizAttemptRepository extends BaseRepository {
  constructor() {
    super('quiz_attempts');
  }

  /**
   * Find all attempts by user and quiz
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<array>} Array of attempts
   */
  async findByUserAndQuiz(userId, quizId) {
    return this.db(this.tableName)
      .where({ user_id: userId, quiz_id: quizId })
      .orderBy('attempt_number', 'desc');
  }

  /**
   * Get attempt count for user and quiz
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<number>} Attempt count
   */
  async countAttempts(userId, quizId) {
    const result = await this.db(this.tableName)
      .where({ user_id: userId, quiz_id: quizId })
      .count('* as count')
      .first();
    return result.count;
  }

  /**
   * Get best attempt for user and quiz
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<object|null>} Best attempt
   */
  async getBestAttempt(userId, quizId) {
    return this.db(this.tableName)
      .where({ user_id: userId, quiz_id: quizId })
      .whereNotNull('score')
      .orderBy('score', 'desc')
      .first();
  }

  /**
   * Get latest attempt for user and quiz
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<object|null>} Latest attempt
   */
  async getLatestAttempt(userId, quizId) {
    return this.db(this.tableName)
      .where({ user_id: userId, quiz_id: quizId })
      .orderBy('created_at', 'desc')
      .first();
  }

  /**
   * Find active (unsubmitted) attempt
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<object|null>} Active attempt
   */
  async findActiveAttempt(userId, quizId) {
    return this.db(this.tableName)
      .where({ user_id: userId, quiz_id: quizId })
      .whereNull('submitted_at')
      .orderBy('created_at', 'desc')
      .first();
  }
}

module.exports = new QuizAttemptRepository();

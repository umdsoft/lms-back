const BaseRepository = require('./base.repository');

class QuizQuestionRepository extends BaseRepository {
  constructor() {
    super('quiz_questions');
  }

  /**
   * Find all questions by quiz ID
   * @param {number} quizId - Quiz ID
   * @returns {Promise<array>} Array of questions
   */
  async findByQuizId(quizId) {
    return this.db(this.tableName)
      .where({ quiz_id: quizId })
      .orderBy('order', 'asc');
  }

  /**
   * Delete all questions for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<number>} Number of deleted questions
   */
  async deleteByQuizId(quizId) {
    return this.db(this.tableName)
      .where({ quiz_id: quizId })
      .del();
  }

  /**
   * Get total points for a quiz
   * @param {number} quizId - Quiz ID
   * @returns {Promise<number>} Total points
   */
  async getTotalPoints(quizId) {
    const result = await this.db(this.tableName)
      .where({ quiz_id: quizId })
      .sum('points as totalPoints')
      .first();
    return result.totalPoints || 0;
  }

  /**
   * Bulk create questions
   * @param {array} questions - Array of question objects
   * @returns {Promise<array>} Array of inserted IDs
   */
  async bulkCreate(questions) {
    return this.db(this.tableName).insert(questions);
  }
}

module.exports = new QuizQuestionRepository();

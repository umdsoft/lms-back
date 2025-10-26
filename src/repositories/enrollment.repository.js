const BaseRepository = require('./base.repository');

/**
 * Enrollment repository
 */
class EnrollmentRepository extends BaseRepository {
  constructor() {
    super('enrollments');
  }

  /**
   * Find enrollment by user and course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise<object|null>} Enrollment or null
   */
  async findByUserAndCourse(userId, courseId) {
    return this.findOne({ user_id: userId, course_id: courseId });
  }

  /**
   * Find all enrollments for a user
   * @param {number} userId - User ID
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of enrollments
   */
  async findByUser(userId, options = {}) {
    return this.db(this.tableName)
      .where({ 'enrollments.user_id': userId })
      .leftJoin('courses', 'enrollments.course_id', 'courses.id')
      .select('enrollments.*', 'courses.title', 'courses.subject', 'courses.level')
      .orderBy(options.orderBy?.column || 'enrollments.created_at', options.orderBy?.direction || 'desc');
  }

  /**
   * Find all enrollments for a course
   * @param {number} courseId - Course ID
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of enrollments
   */
  async findByCourse(courseId, options = {}) {
    return this.db(this.tableName)
      .where({ 'enrollments.course_id': courseId })
      .leftJoin('users', 'enrollments.user_id', 'users.id')
      .select('enrollments.*', 'users.full_name', 'users.email')
      .orderBy(options.orderBy?.column || 'enrollments.created_at', options.orderBy?.direction || 'desc');
  }

  /**
   * Update enrollment progress
   * @param {number} enrollmentId - Enrollment ID
   * @param {number} progressPercentage - Progress percentage
   * @returns {Promise<number>} Number of affected rows
   */
  async updateProgress(enrollmentId, progressPercentage) {
    return this.update(enrollmentId, { progress_percentage: progressPercentage });
  }
}

module.exports = new EnrollmentRepository();

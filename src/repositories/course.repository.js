const BaseRepository = require('./base.repository');

/**
 * Course repository
 */
class CourseRepository extends BaseRepository {
  constructor() {
    super('courses');
  }

  /**
   * Find published courses
   * @param {object} filters - Additional filters
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of courses
   */
  async findPublished(filters = {}, options = {}) {
    return this.findAll(
      { ...filters, status: 'PUBLISHED', deleted_at: null },
      options
    );
  }

  /**
   * Find courses by subject
   * @param {string} subject - Course subject
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of courses
   */
  async findBySubject(subject, options = {}) {
    return this.findPublished({ subject }, options);
  }

  /**
   * Find courses by teacher
   * @param {number} teacherId - Teacher ID
   * @param {object} options - Query options
   * @returns {Promise<array>} Array of courses
   */
  async findByTeacher(teacherId, options = {}) {
    return this.findAll({ teacher_id: teacherId, deleted_at: null }, options);
  }

  /**
   * Get course with teacher info
   * @param {number} courseId - Course ID
   * @returns {Promise<object|null>} Course with teacher or null
   */
  async findByIdWithTeacher(courseId) {
    return this.db(this.tableName)
      .where({ [`${this.tableName}.id`]: courseId, [`${this.tableName}.deleted_at`]: null })
      .leftJoin('users', 'courses.teacher_id', 'users.id')
      .select(
        'courses.*',
        'users.full_name as teacher_name',
        'users.email as teacher_email'
      )
      .first();
  }
}

module.exports = new CourseRepository();

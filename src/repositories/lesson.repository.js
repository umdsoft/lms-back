const BaseRepository = require('./base.repository');

class LessonRepository extends BaseRepository {
  constructor() {
    super('lessons');
  }

  /**
   * Find all lessons by course ID
   * @param {number} courseId - Course ID
   * @param {boolean} publishedOnly - Only return published lessons
   * @returns {Promise<array>} Array of lessons
   */
  async findByCourseId(courseId, publishedOnly = false) {
    let query = this.db(this.tableName)
      .where({ course_id: courseId })
      .whereNull('deleted_at')
      .orderBy('order', 'asc');

    if (publishedOnly) {
      query = query.where({ status: 'PUBLISHED' });
    }

    return query;
  }

  /**
   * Find lesson by ID with course details
   * @param {number} id - Lesson ID
   * @returns {Promise<object|null>} Lesson with course details
   */
  async findByIdWithCourse(id) {
    return this.db(this.tableName)
      .select(
        'lessons.*',
        'courses.title as course_title',
        'courses.teacher_id as teacher_id'
      )
      .leftJoin('courses', 'lessons.course_id', 'courses.id')
      .where('lessons.id', id)
      .whereNull('lessons.deleted_at')
      .first();
  }

  /**
   * Get next lesson in course
   * @param {number} courseId - Course ID
   * @param {number} currentOrder - Current lesson order
   * @returns {Promise<object|null>} Next lesson
   */
  async findNextLesson(courseId, currentOrder) {
    return this.db(this.tableName)
      .where({ course_id: courseId, status: 'PUBLISHED' })
      .where('order', '>', currentOrder)
      .whereNull('deleted_at')
      .orderBy('order', 'asc')
      .first();
  }

  /**
   * Get previous lesson in course
   * @param {number} courseId - Course ID
   * @param {number} currentOrder - Current lesson order
   * @returns {Promise<object|null>} Previous lesson
   */
  async findPreviousLesson(courseId, currentOrder) {
    return this.db(this.tableName)
      .where({ course_id: courseId, status: 'PUBLISHED' })
      .where('order', '<', currentOrder)
      .whereNull('deleted_at')
      .orderBy('order', 'desc')
      .first();
  }

  /**
   * Count lessons by course ID
   * @param {number} courseId - Course ID
   * @returns {Promise<number>} Count of lessons
   */
  async countByCourse(courseId) {
    const result = await this.db(this.tableName)
      .where({ course_id: courseId })
      .whereNull('deleted_at')
      .count('* as count')
      .first();
    return result.count;
  }

  /**
   * Get max order number for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<number>} Max order number
   */
  async getMaxOrder(courseId) {
    const result = await this.db(this.tableName)
      .where({ course_id: courseId })
      .whereNull('deleted_at')
      .max('order as maxOrder')
      .first();
    return result.maxOrder || 0;
  }

  /**
   * Update lesson order
   * @param {number} id - Lesson ID
   * @param {number} newOrder - New order number
   * @returns {Promise<number>} Number of affected rows
   */
  async updateOrder(id, newOrder) {
    return this.update(id, { order: newOrder });
  }
}

module.exports = new LessonRepository();

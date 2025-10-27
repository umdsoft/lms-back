const BaseRepository = require('./base.repository');

class QuizRepository extends BaseRepository {
  constructor() {
    super('quizzes');
  }

  /**
   * Find all quizzes by course ID
   * @param {number} courseId - Course ID
   * @param {boolean} publishedOnly - Only return published quizzes
   * @returns {Promise<array>} Array of quizzes
   */
  async findByCourseId(courseId, publishedOnly = false) {
    let query = this.db(this.tableName)
      .where({ course_id: courseId })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

    if (publishedOnly) {
      query = query.where({ status: 'PUBLISHED' });
    }

    return query;
  }

  /**
   * Find quiz by ID with course details
   * @param {number} id - Quiz ID
   * @returns {Promise<object|null>} Quiz with course details
   */
  async findByIdWithCourse(id) {
    return this.db(this.tableName)
      .select(
        'quizzes.*',
        'courses.title as course_title',
        'courses.teacher_id as teacher_id'
      )
      .leftJoin('courses', 'quizzes.course_id', 'courses.id')
      .where('quizzes.id', id)
      .whereNull('quizzes.deleted_at')
      .first();
  }

  /**
   * Find quiz by lesson ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<object|null>} Quiz
   */
  async findByLessonId(lessonId) {
    return this.db(this.tableName)
      .where({ lesson_id: lessonId })
      .whereNull('deleted_at')
      .first();
  }
}

module.exports = new QuizRepository();

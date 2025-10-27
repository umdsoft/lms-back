const BaseRepository = require('./base.repository');

class LessonProgressRepository extends BaseRepository {
  constructor() {
    super('lesson_progress');
  }

  /**
   * Find or create lesson progress
   * @param {number} userId - User ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<object>} Lesson progress
   */
  async findOrCreate(userId, lessonId) {
    let progress = await this.db(this.tableName)
      .where({ user_id: userId, lesson_id: lessonId })
      .first();

    if (!progress) {
      const id = await this.create({
        user_id: userId,
        lesson_id: lessonId,
        is_completed: false,
        watch_time_seconds: 0,
      });
      progress = await this.findById(id);
    }

    return progress;
  }

  /**
   * Update watch time
   * @param {number} userId - User ID
   * @param {number} lessonId - Lesson ID
   * @param {number} watchTimeSeconds - Watch time in seconds
   * @returns {Promise<void>}
   */
  async updateWatchTime(userId, lessonId, watchTimeSeconds) {
    await this.db(this.tableName)
      .where({ user_id: userId, lesson_id: lessonId })
      .update({
        watch_time_seconds: watchTimeSeconds,
        updated_at: this.db.fn.now(),
      });
  }

  /**
   * Mark lesson as completed
   * @param {number} userId - User ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<void>}
   */
  async markCompleted(userId, lessonId) {
    await this.db(this.tableName)
      .where({ user_id: userId, lesson_id: lessonId })
      .update({
        is_completed: true,
        completed_at: this.db.fn.now(),
        updated_at: this.db.fn.now(),
      });
  }

  /**
   * Get user progress for a course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise<array>} Array of lesson progress
   */
  async findByUserAndCourse(userId, courseId) {
    return this.db(this.tableName)
      .select(
        'lesson_progress.*',
        'lessons.title as lesson_title',
        'lessons.order as lesson_order',
        'lessons.duration_minutes'
      )
      .join('lessons', 'lesson_progress.lesson_id', 'lessons.id')
      .where({
        'lesson_progress.user_id': userId,
        'lessons.course_id': courseId,
      })
      .whereNull('lessons.deleted_at')
      .orderBy('lessons.order', 'asc');
  }

  /**
   * Get completion percentage for a course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise<number>} Completion percentage (0-100)
   */
  async getCourseCompletionPercentage(userId, courseId) {
    const totalLessons = await this.db('lessons')
      .where({ course_id: courseId })
      .whereNull('deleted_at')
      .count('* as count')
      .first();

    const completedLessons = await this.db(this.tableName)
      .join('lessons', 'lesson_progress.lesson_id', 'lessons.id')
      .where({
        'lesson_progress.user_id': userId,
        'lessons.course_id': courseId,
        'lesson_progress.is_completed': true,
      })
      .whereNull('lessons.deleted_at')
      .count('* as count')
      .first();

    if (totalLessons.count === 0) return 0;

    return Math.round((completedLessons.count / totalLessons.count) * 100);
  }
}

module.exports = new LessonProgressRepository();

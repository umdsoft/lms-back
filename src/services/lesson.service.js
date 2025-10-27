const lessonRepository = require('../repositories/lesson.repository');
const lessonProgressRepository = require('../repositories/lesson-progress.repository');
const courseRepository = require('../repositories/course.repository');
const { AppError } = require('../middlewares/error.middleware');

class LessonService {
  /**
   * Create a new lesson
   * @param {number} userId - User ID (teacher)
   * @param {object} lessonData - Lesson data
   * @returns {Promise<object>} Created lesson
   */
  async createLesson(userId, lessonData) {
    const { courseId, title, description, type, content, videoUrl, durationMinutes, order, isFree, status } = lessonData;

    // Verify course exists and user is the teacher
    const course = await courseRepository.findByIdWithTeacher(courseId);
    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    if (course.teacher_id !== userId) {
      throw new AppError('You are not authorized to add lessons to this course.', 403);
    }

    // If order not provided, set it to max + 1
    let lessonOrder = order;
    if (!lessonOrder) {
      const maxOrder = await lessonRepository.getMaxOrder(courseId);
      lessonOrder = maxOrder + 1;
    }

    // Create lesson
    const lessonId = await lessonRepository.create({
      course_id: courseId,
      title,
      description,
      type,
      content,
      video_url: videoUrl,
      duration_minutes: durationMinutes,
      order: lessonOrder,
      is_free: isFree || false,
      status: status || 'DRAFT',
    });

    return lessonRepository.findById(lessonId);
  }

  /**
   * Get all lessons for a course
   * @param {number} courseId - Course ID
   * @param {string} userRole - User role
   * @returns {Promise<array>} Array of lessons
   */
  async getLessonsByCourse(courseId, userRole) {
    // Verify course exists
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    // Students and guests only see published lessons
    const publishedOnly = userRole === 'student' || !userRole;

    return lessonRepository.findByCourseId(courseId, publishedOnly);
  }

  /**
   * Get lesson by ID
   * @param {number} lessonId - Lesson ID
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<object>} Lesson details
   */
  async getLessonById(lessonId, userId, userRole) {
    const lesson = await lessonRepository.findByIdWithCourse(lessonId);

    if (!lesson) {
      throw new AppError('Lesson not found.', 404);
    }

    // Check if user can access draft lessons
    if (lesson.status === 'DRAFT' && userRole !== 'teacher' && userRole !== 'admin') {
      throw new AppError('This lesson is not published yet.', 403);
    }

    // If teacher, verify they own the course
    if (userRole === 'teacher' && lesson.teacher_id !== userId) {
      throw new AppError('You are not authorized to view this lesson.', 403);
    }

    // Get user progress if student
    if (userRole === 'student' && userId) {
      const progress = await lessonProgressRepository.findOrCreate(userId, lessonId);
      lesson.progress = progress;
    }

    // Get next and previous lessons
    const nextLesson = await lessonRepository.findNextLesson(lesson.course_id, lesson.order);
    const previousLesson = await lessonRepository.findPreviousLesson(lesson.course_id, lesson.order);

    lesson.next_lesson_id = nextLesson ? nextLesson.id : null;
    lesson.previous_lesson_id = previousLesson ? previousLesson.id : null;

    return lesson;
  }

  /**
   * Update lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} userId - User ID (teacher)
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated lesson
   */
  async updateLesson(lessonId, userId, updateData) {
    const lesson = await lessonRepository.findByIdWithCourse(lessonId);

    if (!lesson) {
      throw new AppError('Lesson not found.', 404);
    }

    // Verify user is the teacher
    if (lesson.teacher_id !== userId) {
      throw new AppError('You are not authorized to update this lesson.', 403);
    }

    // Prepare update data
    const dataToUpdate = {};
    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.type !== undefined) dataToUpdate.type = updateData.type;
    if (updateData.content !== undefined) dataToUpdate.content = updateData.content;
    if (updateData.videoUrl !== undefined) dataToUpdate.video_url = updateData.videoUrl;
    if (updateData.durationMinutes !== undefined) dataToUpdate.duration_minutes = updateData.durationMinutes;
    if (updateData.order !== undefined) dataToUpdate.order = updateData.order;
    if (updateData.isFree !== undefined) dataToUpdate.is_free = updateData.isFree;
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;

    await lessonRepository.update(lessonId, dataToUpdate);

    return lessonRepository.findById(lessonId);
  }

  /**
   * Delete lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} userId - User ID (teacher)
   * @returns {Promise<void>}
   */
  async deleteLesson(lessonId, userId) {
    const lesson = await lessonRepository.findByIdWithCourse(lessonId);

    if (!lesson) {
      throw new AppError('Lesson not found.', 404);
    }

    // Verify user is the teacher
    if (lesson.teacher_id !== userId) {
      throw new AppError('You are not authorized to delete this lesson.', 403);
    }

    await lessonRepository.softDelete(lessonId);
  }

  /**
   * Update lesson progress
   * @param {number} userId - User ID
   * @param {number} lessonId - Lesson ID
   * @param {object} progressData - Progress data
   * @returns {Promise<object>} Updated progress
   */
  async updateProgress(userId, lessonId, progressData) {
    const lesson = await lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new AppError('Lesson not found.', 404);
    }

    // Find or create progress
    await lessonProgressRepository.findOrCreate(userId, lessonId);

    // Update watch time if provided
    if (progressData.watchTimeSeconds !== undefined) {
      await lessonProgressRepository.updateWatchTime(userId, lessonId, progressData.watchTimeSeconds);
    }

    // Mark as completed if provided
    if (progressData.isCompleted === true) {
      await lessonProgressRepository.markCompleted(userId, lessonId);
    }

    return lessonProgressRepository.findOne({ user_id: userId, lesson_id: lessonId });
  }

  /**
   * Get course progress for a user
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise<object>} Course progress
   */
  async getCourseProgress(userId, courseId) {
    const course = await courseRepository.findById(courseId);

    if (!course) {
      throw new AppError('Course not found.', 404);
    }

    const lessons = await lessonProgressRepository.findByUserAndCourse(userId, courseId);
    const completionPercentage = await lessonProgressRepository.getCourseCompletionPercentage(userId, courseId);

    return {
      course_id: courseId,
      completion_percentage: completionPercentage,
      lessons,
    };
  }
}

module.exports = new LessonService();

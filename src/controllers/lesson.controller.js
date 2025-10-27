const lessonService = require('../services/lesson.service');
const { AppError } = require('../middlewares/error.middleware');

class LessonController {
  /**
   * Create a new lesson
   */
  async createLesson(req, res, next) {
    try {
      const userId = req.user.id;
      const lessonData = {
        courseId: req.body.courseId,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        content: req.body.content,
        videoUrl: req.body.videoUrl,
        durationMinutes: req.body.durationMinutes,
        order: req.body.order,
        isFree: req.body.isFree,
        status: req.body.status,
      };

      const lesson = await lessonService.createLesson(userId, lessonData);

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: { lesson },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all lessons for a course
   */
  async getLessonsByCourse(req, res, next) {
    try {
      const courseId = parseInt(req.params.courseId);
      const userRole = req.user ? req.user.role : null;

      const lessons = await lessonService.getLessonsByCourse(courseId, userRole);

      res.status(200).json({
        success: true,
        data: { lessons },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user ? req.user.id : null;
      const userRole = req.user ? req.user.role : null;

      const lesson = await lessonService.getLessonById(lessonId, userId, userRole);

      res.status(200).json({
        success: true,
        data: { lesson },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lesson
   */
  async updateLesson(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        content: req.body.content,
        videoUrl: req.body.videoUrl,
        durationMinutes: req.body.durationMinutes,
        order: req.body.order,
        isFree: req.body.isFree,
        status: req.body.status,
      };

      const lesson = await lessonService.updateLesson(lessonId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Lesson updated successfully',
        data: { lesson },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lesson
   */
  async deleteLesson(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;

      await lessonService.deleteLesson(lessonId, userId);

      res.status(200).json({
        success: true,
        message: 'Lesson deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lesson progress
   */
  async updateProgress(req, res, next) {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.id;
      const progressData = {
        watchTimeSeconds: req.body.watchTimeSeconds,
        isCompleted: req.body.isCompleted,
      };

      const progress = await lessonService.updateProgress(userId, lessonId, progressData);

      res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        data: { progress },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course progress for current user
   */
  async getCourseProgress(req, res, next) {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;

      const progress = await lessonService.getCourseProgress(userId, courseId);

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();

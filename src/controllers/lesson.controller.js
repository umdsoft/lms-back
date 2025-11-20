const lessonService = require('../services/lesson.service');
const { AppError } = require('../middlewares/error.middleware');

class LessonController {
  /**
   * Get all lessons for a module
   * GET /api/v1/modules/:moduleId/lessons
   * Authenticated users
   */
  async getLessonsByModule(req, res, next) {
    try {
      const { moduleId } = req.params;

      const lessons = await lessonService.getLessonsByModule(moduleId);

      res.status(200).json({
        success: true,
        data: { lessons },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single lesson by ID
   * GET /api/v1/lessons/:id
   * Authenticated users
   */
  async getLessonById(req, res, next) {
    try {
      const { id } = req.params;

      const lesson = await lessonService.getLessonById(id);

      res.status(200).json({
        success: true,
        data: { lesson },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new lesson
   * POST /api/v1/modules/:moduleId/lessons
   * Admin/Teacher only
   */
  async createLesson(req, res, next) {
    try {
      const { moduleId } = req.params;
      const lessonData = req.body;

      const lesson = await lessonService.createLesson(moduleId, lessonData);

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
   * Update lesson
   * PUT /api/v1/lessons/:id
   * Admin/Teacher only
   */
  async updateLesson(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedBy = req.user.email || req.user.phone;

      const lesson = await lessonService.updateLesson(id, updateData, updatedBy);

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
   * DELETE /api/v1/lessons/:id
   * Admin/Teacher only
   */
  async deleteLesson(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBy = req.user.email || req.user.phone;

      await lessonService.deleteLesson(id, deletedBy);

      res.status(200).json({
        success: true,
        message: 'Lesson deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder a single lesson
   * PATCH /api/v1/lessons/:id/reorder
   * Admin/Teacher only
   */
  async reorderLesson(req, res, next) {
    try {
      const { id } = req.params;
      const { order } = req.body;
      const updatedBy = req.user.email || req.user.phone;

      if (order === undefined || order === null) {
        throw new AppError('Order is required', 400);
      }

      const lesson = await lessonService.reorderLesson(id, order, updatedBy);

      res.status(200).json({
        success: true,
        message: 'Lesson reordered successfully',
        data: { lesson },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk reorder lessons
   * POST /api/v1/modules/:moduleId/lessons/reorder-bulk
   * Admin/Teacher only
   */
  async bulkReorderLessons(req, res, next) {
    try {
      const { moduleId } = req.params;
      const reorderData = req.body;
      const updatedBy = req.user.email || req.user.phone;

      if (!Array.isArray(reorderData)) {
        throw new AppError('Reorder data must be an array of { lessonId, order }', 400);
      }

      const lessons = await lessonService.bulkReorderLessons(moduleId, reorderData, updatedBy);

      res.status(200).json({
        success: true,
        message: 'Lessons reordered successfully',
        data: { lessons },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all files for a lesson
   * GET /api/v1/lessons/:id/files
   * Authenticated users
   */
  async getLessonFiles(req, res, next) {
    try {
      const { id } = req.params;

      const files = await lessonService.getLessonFiles(id);

      res.status(200).json({
        success: true,
        data: { files },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add file to lesson
   * POST /api/v1/lessons/:id/files
   * Admin/Teacher only
   */
  async addLessonFile(req, res, next) {
    try {
      const { id } = req.params;
      const { name, url, fileType, fileSize } = req.body;
      const createdBy = req.user.email || req.user.phone;

      if (!name || !url) {
        throw new AppError('File name and url are required', 400);
      }

      const file = await lessonService.addLessonFile(
        id,
        { name, url, fileType, fileSize },
        createdBy
      );

      res.status(201).json({
        success: true,
        message: 'File added successfully',
        data: { file },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete lesson file
   * DELETE /api/v1/lessons/files/:fileId
   * Admin/Teacher only
   */
  async deleteLessonFile(req, res, next) {
    try {
      const { fileId } = req.params;
      const deletedBy = req.user.email || req.user.phone;

      await lessonService.deleteLessonFile(fileId, deletedBy);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();

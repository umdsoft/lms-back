const { Lesson, Module, Course, LessonFile, Test } = require('../models');
const { processVideoUrl } = require('../utils/videoProcessor');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Lesson Service - Sequelize-based with video processing
 */
class LessonService {
  /**
   * Get all lessons by module ID
   * @param {number} moduleId - Module ID
   * @returns {Promise<array>} Lessons with files and tests count
   */
  async getLessonsByModule(moduleId) {
    try {
      // Verify module exists
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      const lessons = await Lesson.findAll({
        where: { moduleId },
        include: [
          {
            model: LessonFile,
            as: 'files',
            attributes: ['id', 'name', 'url', 'fileType', 'fileSize'],
          },
          {
            model: Test,
            as: 'tests',
            attributes: ['id', 'name', 'status'],
          },
        ],
        order: [['order', 'ASC']],
      });

      const lessonsData = lessons.map((lesson) => {
        const lessonData = lesson.toJSON();
        lessonData.filesCount = lessonData.files?.length || 0;
        lessonData.testsCount = lessonData.tests?.length || 0;
        return lessonData;
      });

      return lessonsData;
    } catch (error) {
      logger.error('Get lessons by module error:', error);
      throw error;
    }
  }

  /**
   * Get lesson by ID with full details
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<object>} Lesson details
   */
  async getLessonById(lessonId) {
    try {
      const lesson = await Lesson.findByPk(lessonId, {
        include: [
          {
            model: Module,
            as: 'module',
            attributes: ['id', 'name', 'courseId'],
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'name', 'slug'],
              },
            ],
          },
          {
            model: LessonFile,
            as: 'files',
          },
          {
            model: Test,
            as: 'tests',
          },
        ],
      });

      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      const lessonData = lesson.toJSON();
      lessonData.filesCount = lessonData.files?.length || 0;
      lessonData.testsCount = lessonData.tests?.length || 0;

      return lessonData;
    } catch (error) {
      logger.error('Get lesson by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new lesson
   * @param {number} moduleId - Module ID
   * @param {object} lessonData - Lesson data
   * @returns {Promise<object>} Created lesson
   */
  async createLesson(moduleId, lessonData) {
    try {
      const { name, description, videoUrl, duration, order } = lessonData;

      // Verify module exists
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      // Process video URL
      const videoData = processVideoUrl(videoUrl);

      // If order not provided, set to max + 1
      let lessonOrder = order;
      if (lessonOrder === undefined || lessonOrder === null) {
        const maxLesson = await Lesson.findOne({
          where: { moduleId },
          order: [['order', 'DESC']],
        });
        lessonOrder = maxLesson ? maxLesson.order + 1 : 0;
      }

      // Create lesson
      const lesson = await Lesson.create({
        moduleId,
        name,
        description,
        videoUrl,
        videoType: videoData.type,
        videoEmbedUrl: videoData.embedUrl,
        duration: duration || 0,
        order: lessonOrder,
      });

      logger.info(`Lesson created: ${lesson.name} (ID: ${lesson.id}) in module ${moduleId}`);

      return this.getLessonById(lesson.id);
    } catch (error) {
      logger.error('Create lesson error:', error);
      throw error;
    }
  }

  /**
   * Update lesson
   * @param {number} lessonId - Lesson ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated lesson
   */
  async updateLesson(lessonId, updateData) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      // If video URL is being updated, process it
      if (updateData.videoUrl) {
        const videoData = processVideoUrl(updateData.videoUrl);
        updateData.videoType = videoData.type;
        updateData.videoEmbedUrl = videoData.embedUrl;
      }

      // Update lesson (excluding order - use reorderLesson for that)
      const { order, ...dataToUpdate } = updateData;
      await lesson.update(dataToUpdate);

      logger.info(`Lesson updated: ${lesson.name} (ID: ${lesson.id})`);

      return this.getLessonById(lesson.id);
    } catch (error) {
      logger.error('Update lesson error:', error);
      throw error;
    }
  }

  /**
   * Delete lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<boolean>} Success
   */
  async deleteLesson(lessonId) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      await lesson.destroy();

      logger.info(`Lesson deleted: ${lesson.name} (ID: ${lesson.id})`);

      return true;
    } catch (error) {
      logger.error('Delete lesson error:', error);
      throw error;
    }
  }

  /**
   * Reorder single lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} newOrder - New order position
   * @returns {Promise<object>} Updated lesson
   */
  async reorderLesson(lessonId, newOrder) {
    const transaction = await sequelize.transaction();

    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      const moduleId = lesson.moduleId;
      const oldOrder = lesson.order;

      // If order hasn't changed, return
      if (oldOrder === newOrder) {
        await transaction.commit();
        return this.getLessonById(lessonId);
      }

      if (newOrder > oldOrder) {
        // Moving down
        await Lesson.update(
          { order: sequelize.literal('`order` - 1') },
          {
            where: {
              moduleId,
              order: {
                [Op.gt]: oldOrder,
                [Op.lte]: newOrder,
              },
            },
            transaction,
          }
        );
      } else if (newOrder < oldOrder) {
        // Moving up
        await Lesson.update(
          { order: sequelize.literal('`order` + 1') },
          {
            where: {
              moduleId,
              order: {
                [Op.gte]: newOrder,
                [Op.lt]: oldOrder,
              },
            },
            transaction,
          }
        );
      }

      // Update target lesson
      lesson.order = newOrder;
      await lesson.save({ transaction });

      await transaction.commit();

      logger.info(`Lesson reordered: ${lesson.name} (ID: ${lesson.id}) from ${oldOrder} to ${newOrder}`);

      return this.getLessonById(lesson.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Reorder lesson error:', error);
      throw error;
    }
  }

  /**
   * Bulk reorder lessons
   * @param {number} moduleId - Module ID
   * @param {array} orderData - Array of { lessonId, order }
   * @returns {Promise<array>} Updated lessons
   */
  async bulkReorderLessons(moduleId, orderData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify module exists
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify all lessons belong to this module
      const lessonIds = orderData.map((item) => item.lessonId);
      const lessons = await Lesson.findAll({
        where: {
          id: lessonIds,
          moduleId,
        },
      });

      if (lessons.length !== lessonIds.length) {
        const error = new Error('Some lessons not found or do not belong to this module');
        error.statusCode = 400;
        throw error;
      }

      // Update all lessons
      for (const item of orderData) {
        await Lesson.update(
          { order: item.order },
          {
            where: { id: item.lessonId },
            transaction,
          }
        );
      }

      await transaction.commit();

      logger.info(`Bulk reorder: ${orderData.length} lessons in module ${moduleId}`);

      return this.getLessonsByModule(moduleId);
    } catch (error) {
      await transaction.rollback();
      logger.error('Bulk reorder lessons error:', error);
      throw error;
    }
  }

  /**
   * Add file to lesson
   * @param {number} lessonId - Lesson ID
   * @param {object} fileData - { name, url, fileType, fileSize }
   * @returns {Promise<object>} Created file
   */
  async addLessonFile(lessonId, fileData) {
    try {
      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      const file = await LessonFile.create({
        lessonId,
        ...fileData,
      });

      logger.info(`File added to lesson ${lessonId}: ${file.name}`);

      return file;
    } catch (error) {
      logger.error('Add lesson file error:', error);
      throw error;
    }
  }

  /**
   * Get all files for a lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<array>} Files
   */
  async getLessonFiles(lessonId) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      const files = await LessonFile.findAll({
        where: { lessonId },
      });

      return files;
    } catch (error) {
      logger.error('Get lesson files error:', error);
      throw error;
    }
  }

  /**
   * Delete lesson file
   * @param {number} fileId - File ID
   * @returns {Promise<boolean>} Success
   */
  async deleteLessonFile(fileId) {
    try {
      const file = await LessonFile.findByPk(fileId);
      if (!file) {
        const error = new Error('File not found');
        error.statusCode = 404;
        throw error;
      }

      await file.destroy();

      logger.info(`File deleted: ${file.name} (ID: ${file.id})`);

      return true;
    } catch (error) {
      logger.error('Delete lesson file error:', error);
      throw error;
    }
  }
}

module.exports = new LessonService();

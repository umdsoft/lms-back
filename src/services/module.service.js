const { Module, Course, Lesson } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Module Service - with reordering logic
 */
class ModuleService {
  /**
   * Get all modules by course ID
   * @param {number} courseId - Course ID
   * @returns {Promise<array>} Modules with lesson count
   */
  async getModulesByCourse(courseId) {
    try {
      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      const modules = await Module.findAll({
        where: { courseId },
        include: [
          {
            model: Lesson,
            as: 'lessons',
            attributes: ['id', 'name', 'duration', 'order'],
          },
        ],
        order: [['order', 'ASC']],
      });

      // Add lesson count and total duration
      const modulesData = modules.map((module) => {
        const moduleData = module.toJSON();
        moduleData.lessonCount = moduleData.lessons?.length || 0;
        moduleData.totalDuration = moduleData.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;
        return moduleData;
      });

      return modulesData;
    } catch (error) {
      logger.error('Get modules by course error:', error);
      throw error;
    }
  }

  /**
   * Get module by ID with lessons
   * @param {number} moduleId - Module ID
   * @returns {Promise<object>} Module details
   */
  async getModuleById(moduleId) {
    try {
      const module = await Module.findByPk(moduleId, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'slug'],
          },
          {
            model: Lesson,
            as: 'lessons',
            order: [['order', 'ASC']],
          },
        ],
      });

      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      const moduleData = module.toJSON();
      moduleData.lessonCount = moduleData.lessons?.length || 0;
      moduleData.totalDuration = moduleData.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;

      return moduleData;
    } catch (error) {
      logger.error('Get module by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new module
   * @param {number} courseId - Course ID
   * @param {object} moduleData - { name, description, order }
   * @returns {Promise<object>} Created module
   */
  async createModule(courseId, moduleData) {
    try {
      const { name, description, order } = moduleData;

      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      // If order not provided, set to max + 1
      let moduleOrder = order;
      if (moduleOrder === undefined || moduleOrder === null) {
        const maxModule = await Module.findOne({
          where: { courseId },
          order: [['order', 'DESC']],
        });
        moduleOrder = maxModule ? maxModule.order + 1 : 0;
      }

      // Create module
      const module = await Module.create({
        courseId,
        name,
        description,
        order: moduleOrder,
      });

      logger.info(`Module created: ${module.name} (ID: ${module.id}) in course ${courseId}`);

      return this.getModuleById(module.id);
    } catch (error) {
      logger.error('Create module error:', error);
      throw error;
    }
  }

  /**
   * Update module
   * @param {number} moduleId - Module ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated module
   */
  async updateModule(moduleId, updateData) {
    try {
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      // Update module (excluding order - use reorderModule for that)
      const { order, ...dataToUpdate } = updateData;
      await module.update(dataToUpdate);

      logger.info(`Module updated: ${module.name} (ID: ${module.id})`);

      return this.getModuleById(module.id);
    } catch (error) {
      logger.error('Update module error:', error);
      throw error;
    }
  }

  /**
   * Delete module
   * @param {number} moduleId - Module ID
   * @returns {Promise<boolean>} Success
   */
  async deleteModule(moduleId) {
    try {
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      await module.destroy();

      logger.info(`Module deleted: ${module.name} (ID: ${module.id})`);

      return true;
    } catch (error) {
      logger.error('Delete module error:', error);
      throw error;
    }
  }

  /**
   * Reorder single module
   * @param {number} moduleId - Module ID
   * @param {number} newOrder - New order position
   * @returns {Promise<object>} Updated module
   */
  async reorderModule(moduleId, newOrder) {
    const transaction = await sequelize.transaction();

    try {
      const module = await Module.findByPk(moduleId);
      if (!module) {
        const error = new Error('Module not found');
        error.statusCode = 404;
        throw error;
      }

      const courseId = module.courseId;
      const oldOrder = module.order;

      // If order hasn't changed, return
      if (oldOrder === newOrder) {
        await transaction.commit();
        return this.getModuleById(moduleId);
      }

      if (newOrder > oldOrder) {
        // Moving down: decrease order of modules between old and new position
        await Module.update(
          { order: sequelize.literal('`order` - 1') },
          {
            where: {
              courseId,
              order: {
                [Op.gt]: oldOrder,
                [Op.lte]: newOrder,
              },
            },
            transaction,
          }
        );
      } else if (newOrder < oldOrder) {
        // Moving up: increase order of modules between new and old position
        await Module.update(
          { order: sequelize.literal('`order` + 1') },
          {
            where: {
              courseId,
              order: {
                [Op.gte]: newOrder,
                [Op.lt]: oldOrder,
              },
            },
            transaction,
          }
        );
      }

      // Update target module
      module.order = newOrder;
      await module.save({ transaction });

      await transaction.commit();

      logger.info(`Module reordered: ${module.name} (ID: ${module.id}) from ${oldOrder} to ${newOrder}`);

      return this.getModuleById(module.id);
    } catch (error) {
      await transaction.rollback();
      logger.error('Reorder module error:', error);
      throw error;
    }
  }

  /**
   * Bulk reorder modules
   * @param {number} courseId - Course ID
   * @param {array} orderData - Array of { moduleId, order }
   * @returns {Promise<array>} Updated modules
   */
  async bulkReorderModules(courseId, orderData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify all modules belong to this course
      const moduleIds = orderData.map((item) => item.moduleId);
      const modules = await Module.findAll({
        where: {
          id: moduleIds,
          courseId,
        },
      });

      if (modules.length !== moduleIds.length) {
        const error = new Error('Some modules not found or do not belong to this course');
        error.statusCode = 400;
        throw error;
      }

      // Update all modules
      for (const item of orderData) {
        await Module.update(
          { order: item.order },
          {
            where: { id: item.moduleId },
            transaction,
          }
        );
      }

      await transaction.commit();

      logger.info(`Bulk reorder: ${orderData.length} modules in course ${courseId}`);

      return this.getModulesByCourse(courseId);
    } catch (error) {
      await transaction.rollback();
      logger.error('Bulk reorder modules error:', error);
      throw error;
    }
  }
}

module.exports = new ModuleService();

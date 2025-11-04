const { Course, Direction, User, Module, Lesson } = require('../models');
const { generateUniqueSlug } = require('../utils/slugGenerator');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Course Service - Sequelize-based
 */
class CourseService {
  /**
   * Get all courses with filters and pagination
   * @param {object} filters - { directionId, level, status, pricingType, teacherId }
   * @param {object} pagination - { page, limit }
   * @returns {Promise<object>} { courses, total, totalPages, currentPage }
   */
  async getAllCourses(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const where = {};

      if (filters.directionId) {
        where.directionId = filters.directionId;
      }

      if (filters.level) {
        where.level = filters.level;
      }

      if (filters.status) {
        where.status = filters.status;
      } else {
        // Default: only show active courses
        where.status = 'active';
      }

      if (filters.pricingType) {
        where.pricingType = filters.pricingType;
      }

      if (filters.teacherId) {
        where.teacherId = filters.teacherId;
      }

      const { count, rows } = await Course.findAndCountAll({
        where,
        include: [
          {
            model: Direction,
            as: 'direction',
            attributes: ['id', 'name', 'slug', 'color', 'icon'],
          },
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
      });

      return {
        courses: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      };
    } catch (error) {
      logger.error('Get all courses error:', error);
      throw error;
    }
  }

  /**
   * Get course by ID with full details and statistics
   * @param {number} courseId - Course ID
   * @returns {Promise<object>} Course with stats
   */
  async getCourseById(courseId) {
    try {
      const course = await Course.findByPk(courseId, {
        include: [
          {
            model: Direction,
            as: 'direction',
            attributes: ['id', 'name', 'slug', 'color', 'icon'],
          },
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'firstName', 'lastName', 'avatar', 'email'],
          },
          {
            model: Module,
            as: 'modules',
            include: [
              {
                model: Lesson,
                as: 'lessons',
                attributes: ['id', 'name', 'duration', 'order'],
              },
            ],
            order: [['order', 'ASC']],
          },
        ],
      });

      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      // Calculate statistics
      const courseData = course.toJSON();
      const totalModules = courseData.modules?.length || 0;
      let totalLessons = 0;
      let totalDuration = 0;

      if (courseData.modules) {
        courseData.modules.forEach((module) => {
          totalLessons += module.lessons?.length || 0;
          module.lessons?.forEach((lesson) => {
            totalDuration += lesson.duration || 0;
          });
        });
      }

      courseData.stats = {
        totalModules,
        totalLessons,
        totalDuration, // in seconds
        totalDurationFormatted: this.formatDuration(totalDuration),
      };

      return courseData;
    } catch (error) {
      logger.error('Get course by ID error:', error);
      throw error;
    }
  }

  /**
   * Get courses by direction ID
   * @param {number} directionId - Direction ID
   * @param {object} pagination - { page, limit }
   * @returns {Promise<object>} Courses
   */
  async getCoursesByDirection(directionId, pagination = {}) {
    return this.getAllCourses({ directionId, status: 'active' }, pagination);
  }

  /**
   * Create new course
   * @param {object} courseData - Course data
   * @returns {Promise<object>} Created course
   */
  async createCourse(courseData) {
    try {
      const { name, directionId, level, description, pricingType, price, teacherId, thumbnail } = courseData;

      // CRITICAL: Validate directionId is present (should be caught by validation middleware)
      if (!directionId) {
        logger.error('Create course attempted without directionId', { courseData });
        const error = new Error('Direction ID is required');
        error.statusCode = 400;
        throw error;
      }

      logger.info(`Creating course with directionId: ${directionId}`, { name, level, pricingType });

      // Validate direction exists
      const direction = await Direction.findByPk(directionId);
      if (!direction) {
        logger.error(`Direction not found: ${directionId}`);
        const error = new Error(`Direction with ID ${directionId} not found`);
        error.statusCode = 404;
        throw error;
      }

      logger.info(`Direction found: ${direction.name} (ID: ${direction.id})`);

      // Validate teacher if provided
      if (teacherId) {
        const teacher = await User.findOne({
          where: { id: teacherId, role: 'teacher' },
        });
        if (!teacher) {
          logger.error(`Teacher not found: ${teacherId}`);
          const error = new Error(`Teacher with ID ${teacherId} not found`);
          error.statusCode = 404;
          throw error;
        }
        logger.info(`Teacher found: ${teacher.firstName} ${teacher.lastName} (ID: ${teacher.id})`);
      }

      // Validate pricing
      if (pricingType === 'individual' && (!price || price <= 0)) {
        const error = new Error('Price is required for individual pricing type');
        error.statusCode = 400;
        throw error;
      }

      // Generate unique slug
      const slug = await generateUniqueSlug(name, async (slug) => {
        const existing = await Course.findOne({ where: { slug } });
        return !!existing;
      });

      logger.info(`Generated unique slug: ${slug}`);

      // Create course
      const course = await Course.create({
        name,
        slug,
        directionId,
        level,
        description,
        pricingType: pricingType || 'subscription',
        price: pricingType === 'individual' ? price : 0,
        teacherId,
        thumbnail,
        status: 'draft',
      });

      logger.info(`Course created successfully: ${course.name} (ID: ${course.id})`);

      return this.getCourseById(course.id);
    } catch (error) {
      logger.error('Create course error:', error.message, {
        directionId: courseData.directionId,
        name: courseData.name,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Update course
   * @param {number} courseId - Course ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated course
   */
  async updateCourse(courseId, updateData) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      // Validate direction if being updated
      if (updateData.directionId) {
        const direction = await Direction.findByPk(updateData.directionId);
        if (!direction) {
          const error = new Error('Direction not found');
          error.statusCode = 404;
          throw error;
        }
      }

      // Validate teacher if being updated
      if (updateData.teacherId) {
        const teacher = await User.findOne({
          where: { id: updateData.teacherId, role: 'teacher' },
        });
        if (!teacher) {
          const error = new Error('Teacher not found');
          error.statusCode = 404;
          throw error;
        }
      }

      // Validate pricing
      if (updateData.pricingType === 'individual') {
        if (!updateData.price && !course.price) {
          const error = new Error('Price is required for individual pricing type');
          error.statusCode = 400;
          throw error;
        }
      }

      // Generate new slug if name changed
      if (updateData.name && updateData.name !== course.name) {
        updateData.slug = await generateUniqueSlug(updateData.name, async (slug) => {
          const existing = await Course.findOne({
            where: { slug, id: { [Op.ne]: courseId } },
          });
          return !!existing;
        });
      }

      // Update course
      await course.update(updateData);

      logger.info(`Course updated: ${course.name} (ID: ${course.id})`);

      return this.getCourseById(course.id);
    } catch (error) {
      logger.error('Update course error:', error);
      throw error;
    }
  }

  /**
   * Delete course
   * @param {number} courseId - Course ID
   * @returns {Promise<boolean>} Success
   */
  async deleteCourse(courseId) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      await course.destroy();

      logger.info(`Course deleted: ${course.name} (ID: ${course.id})`);

      return true;
    } catch (error) {
      logger.error('Delete course error:', error);
      throw error;
    }
  }

  /**
   * Update course status
   * @param {number} courseId - Course ID
   * @param {string} status - New status (draft, active, inactive)
   * @returns {Promise<object>} Updated course
   */
  async updateCourseStatus(courseId, status) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        throw error;
      }

      await course.update({ status });

      logger.info(`Course status updated: ${course.name} (ID: ${course.id}) -> ${status}`);

      return this.getCourseById(course.id);
    } catch (error) {
      logger.error('Update course status error:', error);
      throw error;
    }
  }

  /**
   * Format duration from seconds to human-readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

module.exports = new CourseService();

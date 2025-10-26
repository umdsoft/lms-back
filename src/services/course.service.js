const courseRepository = require('../repositories/course.repository');
const enrollmentRepository = require('../repositories/enrollment.repository');
const logger = require('../config/logger');
const { ERROR_CODES } = require('../config/constants');

/**
 * Course service
 */
class CourseService {
  /**
   * Get all published courses
   * @param {object} filters - Filter options
   * @param {object} pagination - Pagination options
   * @returns {Promise<object>} Courses and pagination
   */
  async getAllCourses(filters = {}, pagination = {}) {
    try {
      const queryFilters = {};

      if (filters.subject) {
        queryFilters.subject = filters.subject;
      }

      if (filters.level) {
        queryFilters.level = filters.level;
      }

      const courses = await courseRepository.findPublished(queryFilters, {
        ...pagination,
        orderBy: { column: 'order', direction: 'asc' },
      });

      const total = await courseRepository.count({
        ...queryFilters,
        status: 'PUBLISHED',
        deleted_at: null,
      });

      return { courses, total };
    } catch (error) {
      logger.error('Get all courses error:', error);
      throw error;
    }
  }

  /**
   * Get course by ID
   * @param {number} courseId - Course ID
   * @returns {Promise<object>} Course details
   */
  async getCourseById(courseId) {
    try {
      const course = await courseRepository.findByIdWithTeacher(courseId);
      if (!course) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      return course;
    } catch (error) {
      logger.error('Get course error:', error);
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {object} courseData - Course data
   * @returns {Promise<object>} Created course
   */
  async createCourse(courseData) {
    try {
      const courseId = await courseRepository.create(courseData);
      const course = await courseRepository.findById(courseId);

      logger.info(`Course created: ${course.title}`);
      return course;
    } catch (error) {
      logger.error('Create course error:', error);
      throw error;
    }
  }

  /**
   * Update a course
   * @param {number} courseId - Course ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated course
   */
  async updateCourse(courseId, updateData) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      await courseRepository.update(courseId, updateData);
      const updatedCourse = await courseRepository.findById(courseId);

      logger.info(`Course updated: ${courseId}`);
      return updatedCourse;
    } catch (error) {
      logger.error('Update course error:', error);
      throw error;
    }
  }

  /**
   * Delete a course (soft delete)
   * @param {number} courseId - Course ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCourse(courseId) {
    try {
      const course = await courseRepository.findById(courseId);
      if (!course) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      await courseRepository.softDelete(courseId);

      logger.info(`Course deleted: ${courseId}`);
      return true;
    } catch (error) {
      logger.error('Delete course error:', error);
      throw error;
    }
  }

  /**
   * Enroll user in a course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise<object>} Enrollment
   */
  async enrollInCourse(userId, courseId) {
    try {
      // Check if course exists
      const course = await courseRepository.findById(courseId);
      if (!course || course.status !== 'PUBLISHED') {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      // Check if already enrolled
      const existingEnrollment = await enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      if (existingEnrollment) {
        throw new Error(ERROR_CODES.ALREADY_ENROLLED);
      }

      // Create enrollment
      const enrollmentId = await enrollmentRepository.create({
        user_id: userId,
        course_id: courseId,
        status: 'ENROLLED',
      });

      const enrollment = await enrollmentRepository.findById(enrollmentId);

      logger.info(`User ${userId} enrolled in course ${courseId}`);
      return enrollment;
    } catch (error) {
      logger.error('Enroll in course error:', error);
      throw error;
    }
  }

  /**
   * Get user's enrollments
   * @param {number} userId - User ID
   * @returns {Promise<array>} User enrollments
   */
  async getUserEnrollments(userId) {
    try {
      const enrollments = await enrollmentRepository.findByUser(userId);
      return enrollments;
    } catch (error) {
      logger.error('Get user enrollments error:', error);
      throw error;
    }
  }
}

module.exports = new CourseService();

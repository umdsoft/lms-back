const courseService = require('../services/course.service');
const ResponseUtil = require('../utils/response.util');
const PaginationUtil = require('../utils/pagination.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Course controller
 */
class CourseController {
  /**
   * Get all courses
   * @route GET /api/courses
   */
  async getAllCourses(req, res, next) {
    try {
      const { page, limit, offset } = PaginationUtil.getPaginationParams(req.query);
      const filters = {
        subject: req.query.subject,
        level: req.query.level,
      };

      const { courses, total } = await courseService.getAllCourses(filters, {
        limit,
        offset,
      });

      const pagination = PaginationUtil.buildPaginationResponse(page, limit, total);

      return ResponseUtil.successWithPagination(
        res,
        courses,
        pagination,
        'Courses retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course by ID
   * @route GET /api/courses/:id
   */
  async getCourseById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      return ResponseUtil.success(res, course, 'Course retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new course
   * @route POST /api/courses
   */
  async createCourse(req, res, next) {
    try {
      const courseData = {
        ...req.body,
        teacher_id: req.user.id, // Set current user as teacher
      };

      const course = await courseService.createCourse(courseData);
      return ResponseUtil.success(
        res,
        course,
        'Course created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a course
   * @route PUT /api/courses/:id
   */
  async updateCourse(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      return ResponseUtil.success(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a course
   * @route DELETE /api/courses/:id
   */
  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      return ResponseUtil.success(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Enroll in a course
   * @route POST /api/courses/:id/enroll
   */
  async enrollInCourse(req, res, next) {
    try {
      const enrollment = await courseService.enrollInCourse(
        req.user.id,
        req.params.id
      );
      return ResponseUtil.success(
        res,
        enrollment,
        'Enrolled in course successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user enrollments
   * @route GET /api/profile/enrollments
   */
  async getUserEnrollments(req, res, next) {
    try {
      const enrollments = await courseService.getUserEnrollments(req.user.id);
      return ResponseUtil.success(
        res,
        enrollments,
        'Enrollments retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();

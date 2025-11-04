const courseService = require('../services/course.service');

/**
 * Course Controller
 * Handles all course-related HTTP requests
 */
class CourseController {
  /**
   * Get all courses with filters and pagination
   * @route GET /api/v1/courses
   * @access Public
   */
  async getAllCourses(req, res) {
    try {
      const filters = {
        directionId: req.query.directionId,
        level: req.query.level,
        status: req.query.status,
        pricingType: req.query.pricingType,
        teacherId: req.query.teacherId,
      };

      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await courseService.getAllCourses(filters, pagination);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Get single course by ID
   * @route GET /api/v1/courses/:id
   * @access Public
   */
  async getCourseById(req, res) {
    try {
      const result = await courseService.getCourseById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Get courses by direction ID
   * @route GET /api/v1/directions/:directionId/courses
   * @access Public
   */
  async getCoursesByDirection(req, res) {
    try {
      const pagination = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await courseService.getCoursesByDirection(
        req.params.directionId,
        pagination
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Create new course
   * @route POST /api/v1/courses
   * @access Admin only
   */
  async createCourse(req, res) {
    try {
      const courseData = {
        name: req.body.name,
        directionId: req.body.directionId,
        level: req.body.level,
        description: req.body.description,
        pricingType: req.body.pricingType,
        price: req.body.price,
        teacherId: req.body.teacherId,
        thumbnail: req.body.thumbnail,
      };

      const result = await courseService.createCourse(courseData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Update course
   * @route PUT /api/v1/courses/:id
   * @access Admin only
   */
  async updateCourse(req, res) {
    try {
      const updateData = {
        name: req.body.name,
        directionId: req.body.directionId,
        level: req.body.level,
        description: req.body.description,
        pricingType: req.body.pricingType,
        price: req.body.price,
        teacherId: req.body.teacherId,
        thumbnail: req.body.thumbnail,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const result = await courseService.updateCourse(req.params.id, updateData);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Delete course
   * @route DELETE /api/v1/courses/:id
   * @access Admin only
   */
  async deleteCourse(req, res) {
    try {
      await courseService.deleteCourse(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  /**
   * Update course status
   * @route PATCH /api/v1/courses/:id/status
   * @access Admin only
   */
  async updateCourseStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const result = await courseService.updateCourseStatus(
        req.params.id,
        status
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CourseController();

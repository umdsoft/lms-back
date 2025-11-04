const express = require('express');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateCreateCourse, validateUpdateCourse } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/courses
 * @desc Get all courses with filters and pagination
 * @access Private
 */
router.get('/', courseController.getAllCourses);

/**
 * @route GET /api/v1/courses/directions/:directionId/courses
 * @desc Get all courses for a direction
 * @access Private
 */
router.get('/directions/:directionId/courses', courseController.getCoursesByDirection);

/**
 * @route POST /api/v1/courses
 * @desc Create new course
 * @access Private - Admin only
 */
router.post('/', authorize('admin'), validateCreateCourse, courseController.createCourse);

/**
 * @route GET /api/v1/courses/:id
 * @desc Get course by ID with full details and statistics
 * @access Private
 */
router.get('/:id', courseController.getCourseById);

/**
 * @route PUT /api/v1/courses/:id
 * @desc Update course
 * @access Private - Admin only
 */
router.put('/:id', authorize('admin'), validateUpdateCourse, courseController.updateCourse);

/**
 * @route PATCH /api/v1/courses/:id/status
 * @desc Update course status
 * @access Private - Admin only
 */
router.patch('/:id/status', authorize('admin'), courseController.updateCourseStatus);

/**
 * @route DELETE /api/v1/courses/:id
 * @desc Delete course
 * @access Private - Admin only
 */
router.delete('/:id', authorize('admin'), courseController.deleteCourse);

module.exports = router;

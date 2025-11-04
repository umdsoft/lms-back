const express = require('express');
const testController = require('../controllers/test.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/tests/lessons/:lessonId/tests
 * @desc Get all tests for a lesson
 * @access Private
 */
router.get('/lessons/:lessonId/tests', testController.getTestsByLesson);

/**
 * @route POST /api/v1/tests/lessons/:lessonId/tests
 * @desc Create new test for a lesson
 * @access Private - Admin only
 */
router.post('/lessons/:lessonId/tests', authorize('admin'), testController.createTest);

/**
 * @route GET /api/v1/tests/:id
 * @desc Get test by ID
 * @access Private
 */
router.get('/:id', testController.getTestById);

/**
 * @route PUT /api/v1/tests/:id
 * @desc Update test
 * @access Private - Admin only
 */
router.put('/:id', authorize('admin'), testController.updateTest);

/**
 * @route PATCH /api/v1/tests/:id/status
 * @desc Update test status
 * @access Private - Admin only
 */
router.patch('/:id/status', authorize('admin'), testController.updateTestStatus);

/**
 * @route DELETE /api/v1/tests/:id
 * @desc Delete test
 * @access Private - Admin only
 */
router.delete('/:id', authorize('admin'), testController.deleteTest);

module.exports = router;

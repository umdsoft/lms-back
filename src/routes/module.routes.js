const express = require('express');
const moduleController = require('../controllers/module.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/modules/courses/:courseId/modules
 * @desc Get all modules for a course
 * @access Private
 */
router.get('/courses/:courseId/modules', moduleController.getModulesByCourse);

/**
 * @route POST /api/v1/modules/courses/:courseId/modules
 * @desc Create new module in a course
 * @access Private - Admin only
 */
router.post('/courses/:courseId/modules', authorize('admin'), moduleController.createModule);

/**
 * @route POST /api/v1/modules/courses/:courseId/modules/reorder-bulk
 * @desc Bulk reorder modules in a course
 * @access Private - Admin only
 */
router.post('/courses/:courseId/modules/reorder-bulk', authorize('admin'), moduleController.bulkReorderModules);

/**
 * @route GET /api/v1/modules/:id
 * @desc Get module by ID
 * @access Private
 */
router.get('/:id', moduleController.getModuleById);

/**
 * @route PUT /api/v1/modules/:id
 * @desc Update module
 * @access Private - Admin only
 */
router.put('/:id', authorize('admin'), moduleController.updateModule);

/**
 * @route PATCH /api/v1/modules/:id/reorder
 * @desc Reorder single module
 * @access Private - Admin only
 */
router.patch('/:id/reorder', authorize('admin'), moduleController.reorderModule);

/**
 * @route DELETE /api/v1/modules/:id
 * @desc Delete module
 * @access Private - Admin only
 */
router.delete('/:id', authorize('admin'), moduleController.deleteModule);

module.exports = router;

const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/lessons/modules/:moduleId/lessons
 * @desc Get all lessons for a module
 * @access Private
 */
router.get('/modules/:moduleId/lessons', lessonController.getLessonsByModule);

/**
 * @route POST /api/v1/lessons/modules/:moduleId/lessons
 * @desc Create new lesson in a module
 * @access Private - Admin only
 */
router.post('/modules/:moduleId/lessons', authorize('admin'), lessonController.createLesson);

/**
 * @route POST /api/v1/lessons/modules/:moduleId/lessons/reorder-bulk
 * @desc Bulk reorder lessons in a module
 * @access Private - Admin only
 */
router.post('/modules/:moduleId/lessons/reorder-bulk', authorize('admin'), lessonController.bulkReorderLessons);

/**
 * @route DELETE /api/v1/lessons/files/:fileId
 * @desc Delete lesson file
 * @access Private - Admin only
 */
router.delete('/files/:fileId', authorize('admin'), lessonController.deleteLessonFile);

/**
 * @route GET /api/v1/lessons/:id
 * @desc Get lesson by ID
 * @access Private
 */
router.get('/:id', lessonController.getLessonById);

/**
 * @route PUT /api/v1/lessons/:id
 * @desc Update lesson
 * @access Private - Admin only
 */
router.put('/:id', authorize('admin'), lessonController.updateLesson);

/**
 * @route PATCH /api/v1/lessons/:id/reorder
 * @desc Reorder single lesson
 * @access Private - Admin only
 */
router.patch('/:id/reorder', authorize('admin'), lessonController.reorderLesson);

/**
 * @route DELETE /api/v1/lessons/:id
 * @desc Delete lesson
 * @access Private - Admin only
 */
router.delete('/:id', authorize('admin'), lessonController.deleteLesson);

/**
 * @route GET /api/v1/lessons/:id/files
 * @desc Get all files for a lesson
 * @access Private
 */
router.get('/:id/files', lessonController.getLessonFiles);

/**
 * @route POST /api/v1/lessons/:id/files
 * @desc Add file to lesson
 * @access Private - Admin only
 */
router.post('/:id/files', authorize('admin'), lessonController.addLessonFile);

module.exports = router;

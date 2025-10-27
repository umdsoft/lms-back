const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validation.middleware');
const lessonValidator = require('../validators/lesson.validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *               - type
 *             properties:
 *               courseId:
 *                 type: number
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [VIDEO, TEXT, INTERACTIVE, QUIZ]
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               durationMinutes:
 *                 type: number
 *               order:
 *                 type: number
 *               isFree:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  validate(lessonValidator.create),
  lessonController.createLesson
);

/**
 * @swagger
 * /api/v1/lessons/course/{courseId}:
 *   get:
 *     summary: Get all lessons for a course
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of lessons
 *       404:
 *         description: Course not found
 */
router.get('/course/:courseId', lessonController.getLessonsByCourse);

/**
 * @swagger
 * /api/v1/lessons/course/{courseId}/progress:
 *   get:
 *     summary: Get course progress for current user
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Course progress
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get(
  '/course/:courseId/progress',
  authenticate,
  authorize('student'),
  lessonController.getCourseProgress
);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lesson details
 *       404:
 *         description: Lesson not found
 */
router.get('/:id', lessonController.getLessonById);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   put:
 *     summary: Update lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lesson not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  validate(lessonValidator.update),
  lessonController.updateLesson
);

/**
 * @swagger
 * /api/v1/lessons/{id}:
 *   delete:
 *     summary: Delete lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lesson not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  lessonController.deleteLesson
);

/**
 * @swagger
 * /api/v1/lessons/{id}/progress:
 *   post:
 *     summary: Update lesson progress
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               watchTimeSeconds:
 *                 type: number
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 */
router.post(
  '/:id/progress',
  authenticate,
  authorize('student'),
  validate(lessonValidator.updateProgress),
  lessonController.updateProgress
);

module.exports = router;

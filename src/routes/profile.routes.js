const express = require('express');
const authController = require('../controllers/auth.controller');
const courseController = require('../controllers/course.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const authValidator = require('../validators/auth.validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authController.getCurrentUser);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               preferred_language:
 *                 type: string
 *                 enum: [uz, ru, en]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/',
  authenticate,
  validate(authValidator.updateProfile),
  authController.updateProfile
);

/**
 * @swagger
 * /api/profile/password:
 *   put:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/password',
  authenticate,
  validate(authValidator.changePassword),
  authController.changePassword
);

/**
 * @swagger
 * /api/profile/enrollments:
 *   get:
 *     summary: Get user enrollments
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/enrollments', authenticate, courseController.getUserEnrollments);

module.exports = router;

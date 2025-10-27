const express = require('express');
const quizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { rbac } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate');
const quizValidator = require('../validators/quiz.validator');

const router = express.Router();

// Create quiz
router.post(
  '/',
  authenticate,
  rbac(['teacher', 'admin']),
  validate(quizValidator.create),
  quizController.createQuiz
);

// Get all quizzes for a course
router.get('/course/:courseId', quizController.getQuizzesByCourse);

// Get quiz by ID
router.get('/:id', quizController.getQuizById);

// Update quiz
router.put(
  '/:id',
  authenticate,
  rbac(['teacher', 'admin']),
  validate(quizValidator.update),
  quizController.updateQuiz
);

// Delete quiz
router.delete(
  '/:id',
  authenticate,
  rbac(['teacher', 'admin']),
  quizController.deleteQuiz
);

// Start quiz attempt
router.post(
  '/:id/attempts',
  authenticate,
  rbac(['student']),
  quizController.startQuizAttempt
);

// Submit quiz attempt
router.post(
  '/attempts/:attemptId/submit',
  authenticate,
  rbac(['student']),
  validate(quizValidator.submitAttempt),
  quizController.submitQuizAttempt
);

// Get user's attempts for a quiz
router.get(
  '/:id/attempts',
  authenticate,
  rbac(['student']),
  quizController.getUserAttempts
);

module.exports = router;

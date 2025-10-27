const express = require('express');
const quizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validation.middleware');
const quizValidator = require('../validators/quiz.validator');

const router = express.Router();

// Create quiz
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
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
  authorize('teacher', 'admin'),
  validate(quizValidator.update),
  quizController.updateQuiz
);

// Delete quiz
router.delete(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  quizController.deleteQuiz
);

// Start quiz attempt
router.post(
  '/:id/attempts',
  authenticate,
  authorize('student'),
  quizController.startQuizAttempt
);

// Submit quiz attempt
router.post(
  '/attempts/:attemptId/submit',
  authenticate,
  authorize('student'),
  validate(quizValidator.submitAttempt),
  quizController.submitQuizAttempt
);

// Get user's attempts for a quiz
router.get(
  '/:id/attempts',
  authenticate,
  authorize('student'),
  quizController.getUserAttempts
);

module.exports = router;

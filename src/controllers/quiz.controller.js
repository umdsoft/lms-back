const quizService = require('../services/quiz.service');

class QuizController {
  async createQuiz(req, res, next) {
    try {
      const userId = req.user.id;
      const quizData = req.body;

      const quiz = await quizService.createQuiz(userId, quizData);

      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: { quiz },
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuizzesByCourse(req, res, next) {
    try {
      const courseId = parseInt(req.params.courseId);
      const userRole = req.user ? req.user.role : null;

      const quizzes = await quizService.getQuizzesByCourse(courseId, userRole);

      res.status(200).json({
        success: true,
        data: { quizzes },
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuizById(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const userId = req.user ? req.user.id : null;
      const userRole = req.user ? req.user.role : null;

      const quiz = await quizService.getQuizById(quizId, userId, userRole);

      res.status(200).json({
        success: true,
        data: { quiz },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateQuiz(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const userId = req.user.id;
      const updateData = req.body;

      const quiz = await quizService.updateQuiz(quizId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Quiz updated successfully',
        data: { quiz },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteQuiz(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const userId = req.user.id;

      await quizService.deleteQuiz(quizId, userId);

      res.status(200).json({
        success: true,
        message: 'Quiz deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async startQuizAttempt(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const userId = req.user.id;

      const attempt = await quizService.startQuizAttempt(userId, quizId);

      res.status(201).json({
        success: true,
        message: 'Quiz attempt started',
        data: attempt,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitQuizAttempt(req, res, next) {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const userId = req.user.id;
      const { answers } = req.body;

      const result = await quizService.submitQuizAttempt(userId, attemptId, answers);

      res.status(200).json({
        success: true,
        message: 'Quiz attempt submitted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserAttempts(req, res, next) {
    try {
      const quizId = parseInt(req.params.id);
      const userId = req.user.id;

      const attempts = await quizService.getUserAttempts(userId, quizId);

      res.status(200).json({
        success: true,
        data: { attempts },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();

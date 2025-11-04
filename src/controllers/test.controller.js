const testService = require('../services/test.service');
const { AppError } = require('../middlewares/error.middleware');

class TestController {
  /**
   * Get all tests for a lesson
   * GET /api/v1/lessons/:lessonId/tests
   * Authenticated users
   */
  async getTestsByLesson(req, res, next) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userRole = req.user ? req.user.role : null;

      const tests = await testService.getTestsByLesson(lessonId, userRole);

      res.status(200).json({
        success: true,
        data: { tests },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get test by ID
   * GET /api/v1/tests/:id
   * Authenticated users
   */
  async getTestById(req, res, next) {
    try {
      const testId = parseInt(req.params.id);
      const userId = req.user ? req.user.id : null;
      const userRole = req.user ? req.user.role : null;

      const test = await testService.getTestById(testId, userId, userRole);

      res.status(200).json({
        success: true,
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new test
   * POST /api/v1/lessons/:lessonId/tests
   * Admin/Teacher only
   */
  async createTest(req, res, next) {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;
      const testData = {
        lessonId,
        title: req.body.title,
        description: req.body.description,
        timeLimit: req.body.timeLimit,
        passingScore: req.body.passingScore,
        maxAttempts: req.body.maxAttempts,
        status: req.body.status,
        questions: req.body.questions,
      };

      const test = await testService.createTest(userId, testData);

      res.status(201).json({
        success: true,
        message: 'Test created successfully',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update test
   * PUT /api/v1/tests/:id
   * Admin/Teacher only
   */
  async updateTest(req, res, next) {
    try {
      const testId = parseInt(req.params.id);
      const userId = req.user.id;
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        timeLimit: req.body.timeLimit,
        passingScore: req.body.passingScore,
        maxAttempts: req.body.maxAttempts,
        status: req.body.status,
        questions: req.body.questions,
      };

      const test = await testService.updateTest(testId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Test updated successfully',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update test status
   * PATCH /api/v1/tests/:id/status
   * Admin/Teacher only
   */
  async updateTestStatus(req, res, next) {
    try {
      const testId = parseInt(req.params.id);
      const userId = req.user.id;
      const { status } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const test = await testService.updateTestStatus(testId, userId, status);

      res.status(200).json({
        success: true,
        message: 'Test status updated successfully',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete test
   * DELETE /api/v1/tests/:id
   * Admin/Teacher only
   */
  async deleteTest(req, res, next) {
    try {
      const testId = parseInt(req.params.id);
      const userId = req.user.id;

      await testService.deleteTest(testId, userId);

      res.status(200).json({
        success: true,
        message: 'Test deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TestController();

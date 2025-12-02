const testService = require('../services/test.service');
const { AppError } = require('../middlewares/error.middleware');

class TestController {
  /**
   * Get all tests for a lesson
   * GET /api/v1/tests/lessons/:lessonId/tests
   * Authenticated users
   */
  async getTestsByLesson(req, res, next) {
    try {
      const lessonId = parseInt(req.params.lessonId);

      const tests = await testService.getTestsByLesson(lessonId);

      res.status(200).json({
        success: true,
        data: { tests },
        message: 'Testlar ro\'yxati',
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

      const test = await testService.getTestById(testId);

      res.status(200).json({
        success: true,
        data: test,
        message: 'Test ma\'lumotlari',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new test
   * POST /api/v1/tests/lessons/:lessonId/tests
   * Admin only
   */
  async createTest(req, res, next) {
    try {
      const lessonId = parseInt(req.params.lessonId);

      // Get test data from body
      const testData = {
        question: req.body.question,
        options: req.body.options,
        correctOption: req.body.correctOption !== undefined ? req.body.correctOption : req.body.correct_option,
        explanation: req.body.explanation,
        difficulty: req.body.difficulty,
        points: req.body.points,
        timeLimit: req.body.timeLimit !== undefined ? req.body.timeLimit : req.body.time_limit,
        imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : req.body.image_url,
      };

      const test = await testService.createTest(lessonId, testData);

      res.status(201).json({
        success: true,
        data: test,
        message: 'Test muvaffaqiyatli yaratildi',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update test
   * PUT /api/v1/tests/:id
   * Admin only
   */
  async updateTest(req, res, next) {
    try {
      const testId = parseInt(req.params.id);

      // Pass all body data to service (it handles mapping)
      const test = await testService.updateTest(testId, req.body);

      res.status(200).json({
        success: true,
        data: test,
        message: 'Test muvaffaqiyatli yangilandi',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update test status
   * PATCH /api/v1/tests/:id/status
   * Admin only
   */
  async updateTestStatus(req, res, next) {
    try {
      const testId = parseInt(req.params.id);
      const { status, isActive, is_active } = req.body;

      // Accept status string or isActive boolean
      const actualStatus = status || (isActive !== undefined ? isActive : is_active);

      if (actualStatus === undefined) {
        throw new AppError('Status majburiy', 400);
      }

      const test = await testService.updateTestStatus(testId, actualStatus);

      res.status(200).json({
        success: true,
        data: test,
        message: 'Test statusi yangilandi',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete test
   * DELETE /api/v1/tests/:id
   * Admin only
   */
  async deleteTest(req, res, next) {
    try {
      const testId = parseInt(req.params.id);

      const deletedId = await testService.deleteTest(testId);

      res.status(200).json({
        success: true,
        data: { id: deletedId },
        message: 'Test muvaffaqiyatli o\'chirildi',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TestController();

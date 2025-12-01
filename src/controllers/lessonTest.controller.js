const { Lesson, LessonTest, TestResult, User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

class LessonTestController {
  /**
   * Get all tests for a lesson
   * GET /api/v1/lesson-tests/lessons/:lessonId/tests
   */
  async getTestsByLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      const { difficulty, active_only } = req.query;

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Build query conditions
      const where = { lessonId };
      if (difficulty) {
        where.difficulty = difficulty;
      }
      if (active_only === 'true') {
        where.isActive = true;
      }

      const tests = await LessonTest.findAll({
        where,
        order: [['displayOrder', 'ASC']],
      });

      // Calculate statistics
      const stats = {
        total: tests.length,
        easy: tests.filter((t) => t.difficulty === 'easy').length,
        medium: tests.filter((t) => t.difficulty === 'medium').length,
        hard: tests.filter((t) => t.difficulty === 'hard').length,
        totalPoints: tests.reduce((sum, t) => sum + (t.points || 0), 0),
        activeCount: tests.filter((t) => t.isActive).length,
      };

      res.status(200).json({
        success: true,
        data: { tests },
        stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single test by ID
   * GET /api/v1/lesson-tests/:id
   */
  async getTestById(req, res, next) {
    try {
      const { id } = req.params;

      const test = await LessonTest.findByPk(id, {
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'name', 'moduleId'],
          },
        ],
      });

      if (!test) {
        throw new AppError('Test topilmadi', 404);
      }

      res.status(200).json({
        success: true,
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new test question
   * POST /api/v1/lesson-tests/lessons/:lessonId/tests
   */
  async createTest(req, res, next) {
    try {
      const { lessonId } = req.params;
      const {
        question,
        options,
        correct_option,
        correctOption,
        explanation,
        difficulty,
        points,
        time_limit,
        timeLimit,
      } = req.body;

      // Use camelCase or snake_case
      const actualCorrectOption = correctOption !== undefined ? correctOption : correct_option;
      const actualTimeLimit = timeLimit !== undefined ? timeLimit : time_limit;

      // Validation
      if (!question || !options || actualCorrectOption === undefined) {
        throw new AppError("Savol, variantlar va to'g'ri javob majburiy", 400);
      }

      if (!Array.isArray(options) || options.length < 2) {
        throw new AppError("Kamida 2 ta variant bo'lishi kerak", 400);
      }

      if (options.length > 6) {
        throw new AppError("Maksimum 6 ta variant bo'lishi mumkin", 400);
      }

      if (actualCorrectOption < 0 || actualCorrectOption >= options.length) {
        throw new AppError("To'g'ri javob indeksi noto'g'ri", 400);
      }

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Get next display order
      const lastTest = await LessonTest.findOne({
        where: { lessonId },
        order: [['displayOrder', 'DESC']],
      });
      const displayOrder = lastTest ? lastTest.displayOrder + 1 : 0;

      // Create test
      const test = await LessonTest.create({
        lessonId: parseInt(lessonId),
        question,
        options: options,
        correctOption: actualCorrectOption,
        explanation: explanation || null,
        difficulty: difficulty || 'medium',
        points: points || 10,
        timeLimit: actualTimeLimit || null,
        displayOrder,
        isActive: true,
      });

      logger.info(`Test created: ID ${test.id} for lesson ${lessonId}`);

      res.status(201).json({
        success: true,
        message: 'Test yaratildi',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a test question
   * PUT /api/v1/lesson-tests/:id
   */
  async updateTest(req, res, next) {
    try {
      const { id } = req.params;
      const {
        question,
        options,
        correct_option,
        correctOption,
        explanation,
        difficulty,
        points,
        time_limit,
        timeLimit,
        is_active,
        isActive,
      } = req.body;

      const test = await LessonTest.findByPk(id);
      if (!test) {
        throw new AppError('Test topilmadi', 404);
      }

      // Validation for options if provided
      if (options !== undefined) {
        if (!Array.isArray(options) || options.length < 2) {
          throw new AppError("Kamida 2 ta variant bo'lishi kerak", 400);
        }
        if (options.length > 6) {
          throw new AppError("Maksimum 6 ta variant bo'lishi mumkin", 400);
        }
      }

      // Update fields
      if (question !== undefined) test.question = question;
      if (options !== undefined) test.options = options;

      const actualCorrectOption = correctOption !== undefined ? correctOption : correct_option;
      if (actualCorrectOption !== undefined) {
        const optionsLength = options ? options.length : test.options.length;
        if (actualCorrectOption < 0 || actualCorrectOption >= optionsLength) {
          throw new AppError("To'g'ri javob indeksi noto'g'ri", 400);
        }
        test.correctOption = actualCorrectOption;
      }

      if (explanation !== undefined) test.explanation = explanation;
      if (difficulty !== undefined) test.difficulty = difficulty;
      if (points !== undefined) test.points = points;

      const actualTimeLimit = timeLimit !== undefined ? timeLimit : time_limit;
      if (actualTimeLimit !== undefined) test.timeLimit = actualTimeLimit;

      const actualIsActive = isActive !== undefined ? isActive : is_active;
      if (actualIsActive !== undefined) test.isActive = actualIsActive;

      await test.save();

      logger.info(`Test updated: ID ${id}`);

      res.status(200).json({
        success: true,
        message: 'Test yangilandi',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a test question
   * DELETE /api/v1/lesson-tests/:id
   */
  async deleteTest(req, res, next) {
    try {
      const { id } = req.params;

      const test = await LessonTest.findByPk(id);
      if (!test) {
        throw new AppError('Test topilmadi', 404);
      }

      await test.destroy();

      logger.info(`Test deleted: ID ${id}`);

      res.status(200).json({
        success: true,
        message: "Test o'chirildi",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder tests in a lesson
   * PUT /api/v1/lesson-tests/lessons/:lessonId/reorder
   */
  async reorderTests(req, res, next) {
    try {
      const { lessonId } = req.params;
      const { testIds } = req.body;

      if (!Array.isArray(testIds)) {
        throw new AppError("testIds massiv bo'lishi kerak", 400);
      }

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Update display order for each test
      for (let i = 0; i < testIds.length; i++) {
        await LessonTest.update(
          { displayOrder: i },
          {
            where: {
              id: testIds[i],
              lessonId: parseInt(lessonId),
            },
          }
        );
      }

      // Get updated tests
      const tests = await LessonTest.findAll({
        where: { lessonId },
        order: [['displayOrder', 'ASC']],
      });

      res.status(200).json({
        success: true,
        message: 'Tartib yangilandi',
        data: { tests },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk create tests
   * POST /api/v1/lesson-tests/lessons/:lessonId/bulk
   */
  async bulkCreateTests(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const { lessonId } = req.params;
      const { tests } = req.body;

      if (!Array.isArray(tests) || tests.length === 0) {
        throw new AppError("Testlar ro'yxati bo'sh", 400);
      }

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Get next display order
      const lastTest = await LessonTest.findOne({
        where: { lessonId },
        order: [['displayOrder', 'DESC']],
      });
      let displayOrder = lastTest ? lastTest.displayOrder + 1 : 0;

      // Validate and create tests
      const createdTests = [];
      for (const testData of tests) {
        // Validation
        if (!testData.question || !testData.options) {
          throw new AppError('Har bir testda savol va variantlar bo\'lishi kerak', 400);
        }

        const correctOption = testData.correctOption !== undefined
          ? testData.correctOption
          : testData.correct_option;

        if (correctOption === undefined) {
          throw new AppError("Har bir testda to'g'ri javob ko'rsatilishi kerak", 400);
        }

        if (!Array.isArray(testData.options) || testData.options.length < 2) {
          throw new AppError("Kamida 2 ta variant bo'lishi kerak", 400);
        }

        const test = await LessonTest.create(
          {
            lessonId: parseInt(lessonId),
            question: testData.question,
            options: testData.options,
            correctOption: correctOption,
            explanation: testData.explanation || null,
            difficulty: testData.difficulty || 'medium',
            points: testData.points || 10,
            timeLimit: testData.timeLimit || testData.time_limit || null,
            displayOrder: displayOrder++,
            isActive: true,
          },
          { transaction }
        );

        createdTests.push(test);
      }

      await transaction.commit();

      logger.info(`${createdTests.length} tests bulk created for lesson ${lessonId}`);

      res.status(201).json({
        success: true,
        message: `${createdTests.length} ta test yaratildi`,
        data: { tests: createdTests },
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Submit answer for a test
   * POST /api/v1/lesson-tests/:id/submit
   */
  async submitAnswer(req, res, next) {
    try {
      const { id } = req.params;
      const { selectedOption, timeSpent } = req.body;
      const userId = req.user.id;

      if (selectedOption === undefined) {
        throw new AppError('Javob tanlanmagan', 400);
      }

      const test = await LessonTest.findByPk(id);
      if (!test) {
        throw new AppError('Test topilmadi', 404);
      }

      if (!test.isActive) {
        throw new AppError('Bu test faol emas', 400);
      }

      // Check if answer is correct
      const isCorrect = selectedOption === test.correctOption;
      const pointsEarned = isCorrect ? test.points : 0;

      // Check if user already answered this question
      const existingResult = await TestResult.findOne({
        where: {
          userId,
          testId: id,
        },
      });

      let result;
      if (existingResult) {
        // Update existing result
        existingResult.selectedOption = selectedOption;
        existingResult.isCorrect = isCorrect;
        existingResult.pointsEarned = pointsEarned;
        existingResult.timeSpent = timeSpent || null;
        existingResult.answeredAt = new Date();
        await existingResult.save();
        result = existingResult;
      } else {
        // Create new result
        result = await TestResult.create({
          userId,
          lessonId: test.lessonId,
          testId: parseInt(id),
          selectedOption,
          isCorrect,
          pointsEarned,
          timeSpent: timeSpent || null,
        });
      }

      res.status(200).json({
        success: true,
        message: isCorrect ? "To'g'ri javob!" : "Noto'g'ri javob",
        data: {
          result,
          isCorrect,
          correctOption: test.correctOption,
          explanation: test.explanation,
          pointsEarned,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's results for a lesson
   * GET /api/v1/lesson-tests/lessons/:lessonId/results
   */
  async getLessonResults(req, res, next) {
    try {
      const { lessonId } = req.params;
      const userId = req.user.id;

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        throw new AppError('Dars topilmadi', 404);
      }

      // Get all tests for this lesson
      const tests = await LessonTest.findAll({
        where: { lessonId, isActive: true },
        order: [['displayOrder', 'ASC']],
      });

      // Get user's results
      const results = await TestResult.findAll({
        where: {
          userId,
          lessonId,
        },
        include: [
          {
            model: LessonTest,
            as: 'test',
          },
        ],
      });

      // Calculate statistics
      const totalQuestions = tests.length;
      const answeredQuestions = results.length;
      const correctAnswers = results.filter((r) => r.isCorrect).length;
      const totalPoints = tests.reduce((sum, t) => sum + t.points, 0);
      const earnedPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      res.status(200).json({
        success: true,
        data: {
          results,
          stats: {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            wrongAnswers: answeredQuestions - correctAnswers,
            totalPoints,
            earnedPoints,
            percentage,
            isCompleted: answeredQuestions === totalQuestions,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle test active status
   * PATCH /api/v1/lesson-tests/:id/toggle-active
   */
  async toggleActive(req, res, next) {
    try {
      const { id } = req.params;

      const test = await LessonTest.findByPk(id);
      if (!test) {
        throw new AppError('Test topilmadi', 404);
      }

      test.isActive = !test.isActive;
      await test.save();

      res.status(200).json({
        success: true,
        message: test.isActive ? 'Test faollashtirildi' : 'Test o\'chirildi',
        data: { test },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonTestController();

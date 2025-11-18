const { Test, Lesson, Module, Course } = require('../models');
const logger = require('../utils/logger');

/**
 * Test Service
 */
class TestService {
  /**
   * Get all tests by lesson ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<array>} Tests
   */
  async getTestsByLesson(lessonId) {
    try {
      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      const tests = await Test.findAll({
        where: { lessonId },
        order: [['created_at', 'DESC']],
      });

      return tests;
    } catch (error) {
      logger.error('Get tests by lesson error:', error);
      throw error;
    }
  }

  /**
   * Get test by ID
   * @param {number} testId - Test ID
   * @returns {Promise<object>} Test details
   */
  async getTestById(testId) {
    try {
      const test = await Test.findByPk(testId, {
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'name', 'moduleId'],
            include: [
              {
                model: Module,
                as: 'module',
                attributes: ['id', 'name', 'courseId'],
                include: [
                  {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'name', 'slug'],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!test) {
        const error = new Error('Test not found');
        error.statusCode = 404;
        throw error;
      }

      return test;
    } catch (error) {
      logger.error('Get test by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new test
   * @param {number} lessonId - Lesson ID
   * @param {object} testData - Test data
   * @returns {Promise<object>} Created test
   */
  async createTest(lessonId, testData) {
    try {
      const { name, description, timeLimit, passingScore, status } = testData;

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Lesson not found');
        error.statusCode = 404;
        throw error;
      }

      // Create test
      const test = await Test.create({
        lessonId,
        name,
        description,
        timeLimit: timeLimit || 600,
        passingScore: passingScore || 70,
        status: status || 'draft',
      });

      logger.info(`Test created: ${test.name} (ID: ${test.id}) for lesson ${lessonId}`);

      return this.getTestById(test.id);
    } catch (error) {
      logger.error('Create test error:', error);
      throw error;
    }
  }

  /**
   * Update test
   * @param {number} testId - Test ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated test
   */
  async updateTest(testId, updateData) {
    try {
      const test = await Test.findByPk(testId);
      if (!test) {
        const error = new Error('Test not found');
        error.statusCode = 404;
        throw error;
      }

      await test.update(updateData);

      logger.info(`Test updated: ${test.name} (ID: ${test.id})`);

      return this.getTestById(test.id);
    } catch (error) {
      logger.error('Update test error:', error);
      throw error;
    }
  }

  /**
   * Delete test
   * @param {number} testId - Test ID
   * @returns {Promise<boolean>} Success
   */
  async deleteTest(testId) {
    try {
      const test = await Test.findByPk(testId);
      if (!test) {
        const error = new Error('Test not found');
        error.statusCode = 404;
        throw error;
      }

      await test.destroy();

      logger.info(`Test deleted: ${test.name} (ID: ${test.id})`);

      return true;
    } catch (error) {
      logger.error('Delete test error:', error);
      throw error;
    }
  }

  /**
   * Update test status
   * @param {number} testId - Test ID
   * @param {string} status - New status (draft, active, inactive)
   * @returns {Promise<object>} Updated test
   */
  async updateTestStatus(testId, status) {
    try {
      const test = await Test.findByPk(testId);
      if (!test) {
        const error = new Error('Test not found');
        error.statusCode = 404;
        throw error;
      }

      await test.update({ status });

      logger.info(`Test status updated: ${test.name} (ID: ${test.id}) -> ${status}`);

      return this.getTestById(test.id);
    } catch (error) {
      logger.error('Update test status error:', error);
      throw error;
    }
  }
}

module.exports = new TestService();

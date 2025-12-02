const { LessonTest, Lesson, Module, Course } = require('../models');
const logger = require('../utils/logger');

/**
 * Test Service - For individual lesson test CRUD operations
 */
class TestService {
  /**
   * Format options to include isCorrect for each option
   * @param {array} options - Raw options array
   * @param {number} correctOption - Index of correct option
   * @returns {array} Formatted options with isCorrect
   */
  formatOptionsForResponse(options, correctOption) {
    if (!Array.isArray(options)) {
      return [];
    }
    return options.map((opt, index) => ({
      text: typeof opt === 'string' ? opt : opt.text || opt,
      isCorrect: index === correctOption,
    }));
  }

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
        const error = new Error('Dars topilmadi');
        error.statusCode = 404;
        throw error;
      }

      const tests = await LessonTest.findAll({
        where: { lessonId },
        order: [['display_order', 'ASC']],
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
   * @returns {Promise<object>} Test details with formatted options
   */
  async getTestById(testId) {
    try {
      const test = await LessonTest.findByPk(testId, {
        include: [
          {
            model: Lesson,
            as: 'lesson',
            attributes: ['id', 'name', 'moduleId'],
          },
        ],
      });

      if (!test) {
        const error = new Error('Test topilmadi');
        error.statusCode = 404;
        throw error;
      }

      // Format test data for response
      const testData = test.toJSON();
      testData.options = this.formatOptionsForResponse(testData.options, testData.correctOption);
      testData.imageUrl = testData.imageUrl || null;

      return testData;
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
      const { question, options, correctOption, explanation, difficulty, points, timeLimit } = testData;

      // Verify lesson exists
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        const error = new Error('Dars topilmadi');
        error.statusCode = 404;
        throw error;
      }

      // Get next display order
      const lastTest = await LessonTest.findOne({
        where: { lessonId },
        order: [['display_order', 'DESC']],
      });
      const displayOrder = lastTest ? lastTest.displayOrder + 1 : 0;

      // Create test
      const test = await LessonTest.create({
        lessonId,
        question,
        options,
        correctOption: correctOption || 0,
        explanation: explanation || null,
        difficulty: difficulty || 'medium',
        points: points || 10,
        timeLimit: timeLimit || null,
        displayOrder,
        isActive: true,
      });

      logger.info(`Test created: ID ${test.id} for lesson ${lessonId}`);

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
      const test = await LessonTest.findByPk(testId);
      if (!test) {
        const error = new Error('Test topilmadi');
        error.statusCode = 404;
        throw error;
      }

      // Handle options format conversion
      if (updateData.options && Array.isArray(updateData.options)) {
        // Check if options is in object format [{text, is_correct}]
        if (updateData.options[0] && typeof updateData.options[0] === 'object' && 'text' in updateData.options[0]) {
          // Extract text array and find correct option
          const optionsText = updateData.options.map(opt => opt.text);
          const correctIndex = updateData.options.findIndex(opt => opt.is_correct === true || opt.isCorrect === true);

          updateData.options = optionsText;
          if (correctIndex !== -1) {
            updateData.correctOption = correctIndex;
          }
        }
      }

      // Map snake_case to camelCase
      const mappedData = {};
      if (updateData.question !== undefined) mappedData.question = updateData.question;
      if (updateData.options !== undefined) mappedData.options = updateData.options;
      if (updateData.correctOption !== undefined) mappedData.correctOption = updateData.correctOption;
      if (updateData.correct_option !== undefined) mappedData.correctOption = updateData.correct_option;
      if (updateData.explanation !== undefined) mappedData.explanation = updateData.explanation;
      if (updateData.difficulty !== undefined) mappedData.difficulty = updateData.difficulty;
      if (updateData.points !== undefined) mappedData.points = updateData.points;
      if (updateData.timeLimit !== undefined) mappedData.timeLimit = updateData.timeLimit;
      if (updateData.time_limit !== undefined) mappedData.timeLimit = updateData.time_limit;
      if (updateData.isActive !== undefined) mappedData.isActive = updateData.isActive;
      if (updateData.is_active !== undefined) mappedData.isActive = updateData.is_active;
      if (updateData.imageUrl !== undefined) mappedData.imageUrl = updateData.imageUrl;
      if (updateData.image_url !== undefined) mappedData.imageUrl = updateData.image_url;

      await test.update(mappedData);

      logger.info(`Test updated: ID ${test.id}`);

      return this.getTestById(test.id);
    } catch (error) {
      logger.error('Update test error:', error);
      throw error;
    }
  }

  /**
   * Delete test
   * @param {number} testId - Test ID
   * @returns {Promise<number>} Deleted test ID
   */
  async deleteTest(testId) {
    try {
      const test = await LessonTest.findByPk(testId);
      if (!test) {
        const error = new Error('Test topilmadi');
        error.statusCode = 404;
        throw error;
      }

      const deletedId = test.id;
      await test.destroy();

      logger.info(`Test deleted: ID ${deletedId}`);

      return deletedId;
    } catch (error) {
      logger.error('Delete test error:', error);
      throw error;
    }
  }

  /**
   * Update test status
   * @param {number} testId - Test ID
   * @param {string} status - New status (active/inactive via isActive boolean)
   * @returns {Promise<object>} Updated test
   */
  async updateTestStatus(testId, status) {
    try {
      const test = await LessonTest.findByPk(testId);
      if (!test) {
        const error = new Error('Test topilmadi');
        error.statusCode = 404;
        throw error;
      }

      // Convert status string to isActive boolean
      const isActive = status === 'active' || status === true;
      await test.update({ isActive });

      logger.info(`Test status updated: ID ${test.id} -> ${isActive ? 'active' : 'inactive'}`);

      return this.getTestById(test.id);
    } catch (error) {
      logger.error('Update test status error:', error);
      throw error;
    }
  }
}

module.exports = new TestService();

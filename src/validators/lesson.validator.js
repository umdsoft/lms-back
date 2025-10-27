const Joi = require('joi');

/**
 * Lesson validation schemas
 */
const lessonValidator = {
  /**
   * Create lesson validation schema
   */
  create: Joi.object({
    courseId: Joi.number().integer().positive().required().messages({
      'number.base': 'Course ID must be a number',
      'number.positive': 'Course ID must be positive',
      'any.required': 'Course ID is required',
    }),
    title: Joi.string().min(3).max(255).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().allow('', null).optional(),
    type: Joi.string().valid('VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ').required().messages({
      'any.only': 'Type must be one of VIDEO, TEXT, INTERACTIVE, or QUIZ',
      'any.required': 'Type is required',
    }),
    content: Joi.string().allow('', null).optional(),
    videoUrl: Joi.string().uri().allow('', null).optional().messages({
      'string.uri': 'Video URL must be a valid URI',
    }),
    durationMinutes: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Duration must be a number',
      'number.min': 'Duration must be at least 0',
    }),
    order: Joi.number().integer().positive().optional().messages({
      'number.base': 'Order must be a number',
      'number.positive': 'Order must be positive',
    }),
    isFree: Joi.boolean().optional(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED').default('DRAFT').messages({
      'any.only': 'Status must be either DRAFT or PUBLISHED',
    }),
  }),

  /**
   * Update lesson validation schema
   */
  update: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    type: Joi.string().valid('VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ').optional(),
    content: Joi.string().allow('', null).optional(),
    videoUrl: Joi.string().uri().allow('', null).optional(),
    durationMinutes: Joi.number().integer().min(0).optional(),
    order: Joi.number().integer().positive().optional(),
    isFree: Joi.boolean().optional(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
  }),

  /**
   * Update progress validation schema
   */
  updateProgress: Joi.object({
    watchTimeSeconds: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Watch time must be a number',
      'number.min': 'Watch time must be at least 0',
    }),
    isCompleted: Joi.boolean().optional(),
  }),
};

module.exports = lessonValidator;

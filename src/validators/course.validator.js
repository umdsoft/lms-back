const Joi = require('joi');

/**
 * Course validation schemas
 */
const courseValidator = {
  /**
   * Create course validation schema
   */
  create: Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Description is required',
    }),
    subject: Joi.string().valid('MATHEMATICS', 'ENGLISH').required().messages({
      'any.only': 'Subject must be either MATHEMATICS or ENGLISH',
      'any.required': 'Subject is required',
    }),
    level: Joi.string()
      .valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
      .required()
      .messages({
        'any.only': 'Level must be BEGINNER, INTERMEDIATE, or ADVANCED',
        'any.required': 'Level is required',
      }),
    cover_image_url: Joi.string().uri().optional(),
    duration_weeks: Joi.number().integer().min(1).optional(),
    price: Joi.number().min(0).default(0),
    status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').default('DRAFT'),
    teacher_id: Joi.number().integer().optional(),
    order: Joi.number().integer().min(0).default(0),
  }),

  /**
   * Update course validation schema
   */
  update: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().optional(),
    subject: Joi.string().valid('MATHEMATICS', 'ENGLISH').optional(),
    level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').optional(),
    cover_image_url: Joi.string().uri().optional(),
    duration_weeks: Joi.number().integer().min(1).optional(),
    price: Joi.number().min(0).optional(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').optional(),
    teacher_id: Joi.number().integer().optional(),
    order: Joi.number().integer().min(0).optional(),
  }),

  /**
   * Query courses validation schema
   */
  query: Joi.object({
    subject: Joi.string().valid('MATHEMATICS', 'ENGLISH').optional(),
    level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

module.exports = courseValidator;

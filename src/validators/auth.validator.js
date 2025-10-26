const Joi = require('joi');

/**
 * Authentication validation schemas
 */
const authValidator = {
  /**
   * Registration validation schema
   */
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required',
    }),
    full_name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name must not exceed 255 characters',
      'any.required': 'Full name is required',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    role: Joi.string().valid('STUDENT', 'TEACHER').default('STUDENT'),
    preferred_language: Joi.string().valid('uz', 'ru', 'en').default('uz'),
  }),

  /**
   * Login validation schema
   */
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  /**
   * Change password validation schema
   */
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
      'string.min': 'New password must be at least 8 characters long',
      'any.required': 'New password is required',
    }),
  }),

  /**
   * Update profile validation schema
   */
  updateProfile: Joi.object({
    full_name: Joi.string().min(2).max(255).optional(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional(),
    avatar_url: Joi.string().uri().optional(),
    preferred_language: Joi.string().valid('uz', 'ru', 'en').optional(),
  }),
};

module.exports = authValidator;

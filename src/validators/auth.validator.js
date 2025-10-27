const Joi = require('joi');

/**
 * Authentication validation schemas
 */
const authValidator = {
  /**
   * Registration validation schema
   */
  register: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required',
    }),
    role: Joi.string().valid('student', 'teacher', 'admin').default('student'),
  }).custom((value, helpers) => {
    // At least one of email or phone must be provided
    if (!value.email && !value.phone) {
      return helpers.error('any.custom', { message: 'Either email or phone number is required' });
    }
    return value;
  }),

  /**
   * Login validation schema
   */
  login: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }).custom((value, helpers) => {
    // At least one of email or phone must be provided
    if (!value.email && !value.phone) {
      return helpers.error('any.custom', { message: 'Either email or phone number is required' });
    }
    return value;
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
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional(),
    avatar: Joi.string().uri().optional(),
  }),
};

module.exports = authValidator;

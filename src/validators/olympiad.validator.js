const Joi = require('joi');

const olympiadValidator = {
  create: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow('', null).optional(),
    subject: Joi.string().valid('MATHEMATICS', 'ENGLISH').required(),
    level: Joi.string().valid('REGIONAL', 'NATIONAL', 'INTERNATIONAL').required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    registrationDeadline: Joi.date().iso().required(),
    maxParticipants: Joi.number().integer().min(1).optional(),
    durationMinutes: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('UPCOMING', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').default('UPCOMING'),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    subject: Joi.string().valid('MATHEMATICS', 'ENGLISH').optional(),
    level: Joi.string().valid('REGIONAL', 'NATIONAL', 'INTERNATIONAL').optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    registrationDeadline: Joi.date().iso().optional(),
    maxParticipants: Joi.number().integer().min(1).optional(),
    durationMinutes: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid('UPCOMING', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').optional(),
  }),

  updateScore: Joi.object({
    score: Joi.number().min(0).max(100).required(),
  }),
};

module.exports = olympiadValidator;

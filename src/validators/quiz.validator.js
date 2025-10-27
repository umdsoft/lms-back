const Joi = require('joi');

const questionSchema = Joi.object({
  questionText: Joi.string().min(5).required(),
  questionType: Joi.string().valid('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER').required(),
  options: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.string().required(),
  explanation: Joi.string().allow('', null).optional(),
  points: Joi.number().integer().min(1).default(1),
  order: Joi.number().integer().positive().optional(),
});

const quizValidator = {
  create: Joi.object({
    courseId: Joi.number().integer().positive().required(),
    lessonId: Joi.number().integer().positive().optional(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow('', null).optional(),
    durationMinutes: Joi.number().integer().min(1).optional(),
    passingScore: Joi.number().min(0).max(100).required(),
    maxAttempts: Joi.number().integer().min(1).default(3),
    status: Joi.string().valid('DRAFT', 'PUBLISHED').default('DRAFT'),
    questions: Joi.array().items(questionSchema).min(1).required(),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    durationMinutes: Joi.number().integer().min(1).optional(),
    passingScore: Joi.number().min(0).max(100).optional(),
    maxAttempts: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid('DRAFT', 'PUBLISHED').optional(),
    questions: Joi.array().items(questionSchema).min(1).optional(),
  }),

  submitAttempt: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.number().integer().positive().required(),
        answer: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()).required(),
      })
    ).min(1).required(),
  }),
};

module.exports = quizValidator;

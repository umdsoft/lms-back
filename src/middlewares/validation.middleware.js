const ResponseUtil = require('../utils/response.util');

/**
 * Validation middleware factory
 * @param {object} schema - Joi validation schema
 * @param {string} source - Source of data to validate (body, query, params)
 * @returns {function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return ResponseUtil.validationError(res, errors);
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = validate;

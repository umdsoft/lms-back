const Joi = require('joi');

/**
 * validate(schema, property = 'body')
 * returns express middleware
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => d.message);
      return res.status(400).json({ error: 'Validation error', details });
    }
    req[property] = value;
    next();
  };
}

module.exports = validate;
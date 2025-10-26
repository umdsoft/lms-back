const validator = require('validator');
const { AppError } = require('./error.middleware');

const validateRegister = (req, _res, next) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  // Validate password
  if (!password || password.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400);
  }

  // Validate firstName
  if (!firstName || firstName.trim().length === 0) {
    throw new AppError('First name is required.', 400);
  }

  if (firstName.length > 50) {
    throw new AppError('First name cannot exceed 50 characters.', 400);
  }

  // Validate lastName
  if (!lastName || lastName.trim().length === 0) {
    throw new AppError('Last name is required.', 400);
  }

  if (lastName.length > 50) {
    throw new AppError('Last name cannot exceed 50 characters.', 400);
  }

  // Validate role if provided
  if (role && !['student', 'teacher', 'admin'].includes(role)) {
    throw new AppError('Role must be one of: student, teacher, admin.', 400);
  }

  next();
};

const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  // Validate password
  if (!password) {
    throw new AppError('Password is required.', 400);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};

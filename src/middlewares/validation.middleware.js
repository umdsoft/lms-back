const validator = require('validator');
const { AppError } = require('./error.middleware');
const { normalizeDirectionPayload } = require('../utils/direction.util');

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
  const { phone, password } = req.body;

  // Validate phone
  if (!phone) {
    throw new AppError('Phone number is required.', 400);
  }

  // Validate phone format
  if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    throw new AppError('Please provide a valid phone number.', 400);
  }

  // Validate password
  if (!password) {
    throw new AppError('Password is required.', 400);
  }

  next();
};

const validateCreateUser = (req, _res, next) => {
  const { email, password, firstName, lastName, role, phone } = req.body;

  // Validate email if provided
  if (email && !validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  // At least email or phone must be provided
  if (!email && !phone) {
    throw new AppError('Either email or phone number is required.', 400);
  }

  // Validate password
  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }

  // Check password strength
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new AppError(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      400
    );
  }

  // Validate firstName
  if (!firstName || firstName.trim().length < 2) {
    throw new AppError('First name must be at least 2 characters long.', 400);
  }

  if (firstName.length > 50) {
    throw new AppError('First name cannot exceed 50 characters.', 400);
  }

  // Validate lastName
  if (!lastName || lastName.trim().length < 2) {
    throw new AppError('Last name must be at least 2 characters long.', 400);
  }

  if (lastName.length > 50) {
    throw new AppError('Last name cannot exceed 50 characters.', 400);
  }

  // Validate role if provided
  if (role && !['student', 'teacher', 'admin'].includes(role)) {
    throw new AppError('Role must be one of: student, teacher, admin.', 400);
  }

  // Validate phone if provided
  if (phone && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    throw new AppError('Please provide a valid phone number.', 400);
  }

  next();
};

const validateUpdateUser = (req, _res, next) => {
  const { email, firstName, lastName, phone } = req.body;

  // Validate email if provided
  if (email !== undefined && email !== null && !validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  // Validate firstName if provided
  if (firstName !== undefined && firstName !== null) {
    if (firstName.trim().length < 2) {
      throw new AppError('First name must be at least 2 characters long.', 400);
    }
    if (firstName.length > 50) {
      throw new AppError('First name cannot exceed 50 characters.', 400);
    }
  }

  // Validate lastName if provided
  if (lastName !== undefined && lastName !== null) {
    if (lastName.trim().length < 2) {
      throw new AppError('Last name must be at least 2 characters long.', 400);
    }
    if (lastName.length > 50) {
      throw new AppError('Last name cannot exceed 50 characters.', 400);
    }
  }

  // Validate phone if provided
  if (phone !== undefined && phone !== null && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    throw new AppError('Please provide a valid phone number.', 400);
  }

  next();
};

const validateUpdateRole = (req, _res, next) => {
  const { role } = req.body;

  if (!role) {
    throw new AppError('Role is required.', 400);
  }

  if (!['student', 'teacher', 'admin'].includes(role)) {
    throw new AppError('Role must be one of: student, teacher, admin.', 400);
  }

  next();
};

const validateUpdateStatus = (req, _res, next) => {
  const { status, reason } = req.body;

  if (!status) {
    throw new AppError('Status is required.', 400);
  }

  if (!['active', 'inactive', 'blocked'].includes(status)) {
    throw new AppError('Status must be one of: active, inactive, blocked.', 400);
  }

  // Require reason for blocking
  if (status === 'blocked' && !reason) {
    throw new AppError('Reason is required when blocking a user.', 400);
  }

  next();
};

const validateChangePassword = (req, _res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    throw new AppError('Current password is required.', 400);
  }

  if (!newPassword) {
    throw new AppError('New password is required.', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters long.', 400);
  }

  // Check password strength
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new AppError(
      'New password must contain at least one uppercase letter, one lowercase letter, and one number.',
      400
    );
  }

  next();
};

const validateCreateDirection = (req, _res, next) => {
  req.body = normalizeDirectionPayload(req.body);

  const { name, color, display_order } = req.body;

  // Validate name
  if (!name || name.trim().length < 3) {
    throw new AppError('Direction name must be at least 3 characters long.', 400);
  }

  if (name.length > 100) {
    throw new AppError('Direction name cannot exceed 100 characters.', 400);
  }

  // Validate color
  if (!color) {
    throw new AppError('Direction color is required.', 400);
  }

  const validColors = ['blue', 'purple', 'orange', 'green', 'red', 'indigo', 'pink', 'yellow', 'teal', 'cyan'];
  if (!validColors.includes(color)) {
    throw new AppError(
      `Color must be one of: ${validColors.join(', ')}.`,
      400
    );
  }

  // Validate description if provided
  const { description } = req.body;
  if (description && description.length > 500) {
    throw new AppError('Description cannot exceed 500 characters.', 400);
  }

  // Validate displayOrder if provided (optional, defaults to 0)
  if (display_order !== undefined && display_order !== null && display_order !== '') {
    const numericDisplayOrder = Number(display_order);

    if (!Number.isFinite(numericDisplayOrder) || !Number.isInteger(numericDisplayOrder)) {
      throw new AppError('Display order must be an integer.', 400);
    }

    if (numericDisplayOrder < 0) {
      throw new AppError('Display order must be at least 0', 400);
    }

    req.body.display_order = numericDisplayOrder;
    req.body.displayOrder = numericDisplayOrder;
  } else {
    // Set default value if not provided
    req.body.display_order = 0;
    req.body.displayOrder = 0;
  }

  next();
};

const validateUpdateDirection = (req, _res, next) => {
  req.body = normalizeDirectionPayload(req.body);

  const { name, color, description, display_order } = req.body;

  // Validate name if provided
  if (name !== undefined) {
    if (name.trim().length < 3) {
      throw new AppError('Direction name must be at least 3 characters long.', 400);
    }
    if (name.length > 100) {
      throw new AppError('Direction name cannot exceed 100 characters.', 400);
    }
  }

  // Validate color if provided
  if (color !== undefined) {
    const validColors = ['blue', 'purple', 'orange', 'green', 'red', 'indigo', 'pink', 'yellow', 'teal', 'cyan'];
    if (!validColors.includes(color)) {
      throw new AppError(
        `Color must be one of: ${validColors.join(', ')}.`,
        400
      );
    }
  }

  // Validate description if provided
  if (description !== undefined && description !== null && description.length > 500) {
    throw new AppError('Description cannot exceed 500 characters.', 400);
  }

  // Validate displayOrder if provided
  if (display_order !== undefined && display_order !== null && display_order !== '') {
    const numericDisplayOrder = Number(display_order);

    if (!Number.isFinite(numericDisplayOrder) || !Number.isInteger(numericDisplayOrder)) {
      throw new AppError('Display order must be an integer.', 400);
    }

    if (numericDisplayOrder < 0) {
      throw new AppError('Display order must be at least 0', 400);
    }

    req.body.display_order = numericDisplayOrder;
    req.body.displayOrder = numericDisplayOrder;
  }

  next();
};

const validateDirectionStatus = (req, _res, next) => {
  const { status } = req.body;

  if (!status) {
    throw new AppError('Status is required.', 400);
  }

  if (!['active', 'inactive'].includes(status)) {
    throw new AppError('Status must be one of: active, inactive.', 400);
  }

  next();
};

const validateAddSubjects = (req, _res, next) => {
  const { subjects } = req.body;

  if (!subjects || !Array.isArray(subjects)) {
    throw new AppError('Subjects must be an array.', 400);
  }

  if (subjects.length === 0) {
    throw new AppError('Subjects array cannot be empty.', 400);
  }

  // Validate each subject
  for (const subject of subjects) {
    if (typeof subject !== 'string' || subject.trim().length < 2) {
      throw new AppError('Each subject name must be at least 2 characters long.', 400);
    }
    if (subject.length > 100) {
      throw new AppError('Subject name cannot exceed 100 characters.', 400);
    }
  }

  next();
};

const validateAssignTeachers = (req, _res, next) => {
  const { teacherIds } = req.body;

  if (!teacherIds || !Array.isArray(teacherIds)) {
    throw new AppError('Teacher IDs must be an array.', 400);
  }

  if (teacherIds.length === 0) {
    throw new AppError('Teacher IDs array cannot be empty.', 400);
  }

  // Validate each teacherId is a number
  for (const teacherId of teacherIds) {
    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      throw new AppError('Each teacher ID must be a positive integer.', 400);
    }
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateRole,
  validateUpdateStatus,
  validateChangePassword,
  validateCreateDirection,
  validateUpdateDirection,
  validateDirectionStatus,
  validateAddSubjects,
  validateAssignTeachers,
};

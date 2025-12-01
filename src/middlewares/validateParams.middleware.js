/**
 * Parameter Validation Middleware
 * Route params validation uchun middleware'lar
 */

const { AppError } = require('./error.middleware');

/**
 * Validate lessonId parameter
 * - undefined, null, empty string tekshirish
 * - Musbat butun son ekanligini tekshirish
 */
const validateLessonId = (req, res, next) => {
  const { lessonId } = req.params;

  // undefined, null, empty string, "undefined", "null" tekshirish
  if (
    !lessonId ||
    lessonId === 'undefined' ||
    lessonId === 'null' ||
    lessonId.trim() === ''
  ) {
    return next(new AppError('lessonId parametri majburiy', 400));
  }

  // Number ekanligini tekshirish
  const id = parseInt(lessonId, 10);

  if (isNaN(id)) {
    return next(new AppError("lessonId butun son bo'lishi kerak", 400));
  }

  if (id <= 0) {
    return next(new AppError("lessonId musbat son bo'lishi kerak", 400));
  }

  // req.params ni yangilash (parsed integer)
  req.params.lessonId = id;
  next();
};

/**
 * Generic ID parameter validator
 * @param {string} paramName - Parameter nomi (masalan: 'id', 'fileId', 'testId')
 * @returns {function} Express middleware
 */
const validateIdParam = (paramName) => {
  return (req, res, next) => {
    const paramValue = req.params[paramName];

    // undefined, null, empty string tekshirish
    if (
      !paramValue ||
      paramValue === 'undefined' ||
      paramValue === 'null' ||
      (typeof paramValue === 'string' && paramValue.trim() === '')
    ) {
      return next(new AppError(`${paramName} parametri majburiy`, 400));
    }

    // Number ekanligini tekshirish
    const id = parseInt(paramValue, 10);

    if (isNaN(id)) {
      return next(new AppError(`${paramName} butun son bo'lishi kerak`, 400));
    }

    if (id <= 0) {
      return next(new AppError(`${paramName} musbat son bo'lishi kerak`, 400));
    }

    // req.params ni yangilash
    req.params[paramName] = id;
    next();
  };
};

module.exports = {
  validateLessonId,
  validateIdParam,
};

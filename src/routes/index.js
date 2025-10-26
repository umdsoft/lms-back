const express = require('express');
const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const profileRoutes = require('./profile.routes');
const { validateCsrfToken } = require('../middlewares/csrf.middleware');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LMS Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Apply CSRF protection to all routes except auth endpoints
 * (auth endpoints handle CSRF internally)
 */
router.use('/auth', authRoutes);

// Apply CSRF protection to protected routes
router.use(validateCsrfToken);

router.use('/courses', courseRoutes);
router.use('/profile', profileRoutes);

module.exports = router;

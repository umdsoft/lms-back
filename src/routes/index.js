const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const courseRoutes = require('./course.routes');
const lessonRoutes = require('./lesson.routes');
const quizRoutes = require('./quiz.routes');
const olympiadRoutes = require('./olympiad.routes');
const profileRoutes = require('./profile.routes');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/olympiads', olympiadRoutes);
router.use('/profile', profileRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'LMS Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

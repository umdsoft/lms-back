const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const LessonProgress = sequelize.define('LessonProgress', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'user_id',
  },
  lessonId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'lesson_id',
  },
  enrollmentId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'enrollment_id',
  },
  videoWatchedSeconds: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'video_watched_seconds',
  },
  videoLastPosition: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'video_last_position',
  },
  videoCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'video_completed',
  },
  videoCompletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'video_completed_at',
  },
  testPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'test_passed',
  },
  testBestScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    field: 'test_best_score',
  },
  testAttemptsCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'test_attempts_count',
  },
  testPassedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'test_passed_at',
  },
  progress: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_completed',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
  totalTimeSpent: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_time_spent',
  },
}, {
  tableName: 'lesson_progress',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = LessonProgress;

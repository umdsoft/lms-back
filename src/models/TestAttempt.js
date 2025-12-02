const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TestAttempt = sequelize.define('TestAttempt', {
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
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'course_id',
  },
  testType: {
    type: DataTypes.ENUM('lesson', 'module', 'final'),
    allowNull: false,
    field: 'test_type',
  },
  targetId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'target_id',
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  questionCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    field: 'question_count',
  },
  totalPoints: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'total_points',
  },
  earnedPoints: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'earned_points',
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
  },
  passingScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'passing_score',
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  correctCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'correct_count',
  },
  wrongCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'wrong_count',
  },
  skippedCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'skipped_count',
  },
  timeLimit: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'time_limit',
  },
  timeTaken: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'time_taken',
  },
  violationsCount: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'violations_count',
  },
  violationLog: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'violation_log',
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'expired', 'cancelled'),
    defaultValue: 'in_progress',
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'started_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
}, {
  tableName: 'test_attempts',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TestAttempt;

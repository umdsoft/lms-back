const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TestAnswer = sequelize.define('TestAnswer', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  attemptId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'attempt_id',
  },
  questionId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'question_id',
  },
  userAnswer: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'user_answer',
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'is_correct',
  },
  partialCredit: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    field: 'partial_credit',
  },
  earnedPoints: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'earned_points',
  },
  timeSpent: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'time_spent',
  },
  answeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'answered_at',
  },
}, {
  tableName: 'test_answers',
  underscored: true,
  timestamps: false,
});

module.exports = TestAnswer;

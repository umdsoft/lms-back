const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  lessonId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'lesson_id',
    references: {
      model: 'lessons',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  testId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'test_id',
    references: {
      model: 'lesson_tests',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  selectedOption: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'selected_option',
    comment: 'Index of selected answer',
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_correct',
    comment: 'Whether the answer is correct',
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'points_earned',
    comment: 'Points earned for this answer',
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_spent',
    comment: 'Time spent in seconds',
  },
  answeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'answered_at',
    comment: 'When the answer was submitted',
  },
}, {
  tableName: 'test_results',
  underscored: true,
  timestamps: false,
  indexes: [
    {
      fields: ['user_id', 'lesson_id'],
    },
    {
      fields: ['test_id'],
    },
    {
      fields: ['user_id'],
    },
  ],
});

// Override toJSON to ensure camelCase response format
TestResult.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Convert snake_case to camelCase
  if (values.answered_at) {
    values.answeredAt = values.answered_at;
    delete values.answered_at;
  }

  return values;
};

module.exports = TestResult;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'course_id',
  },
  moduleId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'module_id',
  },
  lessonId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'lesson_id',
  },
  testType: {
    type: DataTypes.ENUM('lesson', 'module', 'final'),
    allowNull: false,
    field: 'test_type',
  },
  type: {
    type: DataTypes.ENUM('single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching', 'ordering'),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
  },
  points: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 10,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text',
  },
  questionImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'question_image',
  },
  correctAnswers: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'correct_answers',
  },
  caseSensitive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'case_sensitive',
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attemptsCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'attempts_count',
  },
  correctCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'correct_count',
  },
  avgTimeSeconds: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'avg_time_seconds',
  },
  orderIndex: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'order_index',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'questions',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Question;

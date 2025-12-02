const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const QuestionOption = sequelize.define('QuestionOption', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  questionId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'question_id',
  },
  optionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'option_text',
  },
  optionImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'option_image',
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_correct',
  },
  orderIndex: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'order_index',
  },
}, {
  tableName: 'question_options',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = QuestionOption;

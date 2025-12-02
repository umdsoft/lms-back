const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const LessonResource = sequelize.define('LessonResource', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  lessonId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'lesson_id',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('file', 'link', 'code'),
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'file_url',
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_name',
  },
  fileSize: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'file_size',
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'file_type',
  },
  linkUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'link_url',
  },
  codeContent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'code_content',
  },
  codeLanguage: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'code_language',
  },
  orderIndex: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'order_index',
  },
}, {
  tableName: 'lesson_resources',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at',
});

module.exports = LessonResource;

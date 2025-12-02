const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  moduleId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'module_id',
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'course_id',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contentType: {
    type: DataTypes.ENUM('video', 'text', 'quiz', 'assignment'),
    defaultValue: 'video',
    field: 'content_type',
  },
  videoId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'video_id',
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'video_url',
  },
  videoDuration: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'video_duration',
  },
  videoStatus: {
    type: DataTypes.ENUM('pending', 'uploading', 'processing', 'ready', 'failed'),
    defaultValue: 'pending',
    field: 'video_status',
  },
  videoQualities: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'video_qualities',
  },
  videoThumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'video_thumbnail_url',
  },
  textContent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'text_content',
  },
  isFreePreview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_free_preview',
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_published',
  },
  viewsCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'views_count',
  },
  orderIndex: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'order_index',
  },
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Lesson;

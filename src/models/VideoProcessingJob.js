const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const VideoProcessingJob = sequelize.define('VideoProcessingJob', {
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
  sourceKey: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'source_key',
  },
  sourceSize: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'source_size',
  },
  sourceDuration: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'source_duration',
  },
  outputKey: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'output_key',
  },
  outputQualities: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'output_qualities',
  },
  status: {
    type: DataTypes.ENUM('pending', 'downloading', 'transcoding', 'uploading', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  progress: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  currentStep: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'current_step',
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message',
  },
  attempts: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
  },
  maxAttempts: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 3,
    field: 'max_attempts',
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
}, {
  tableName: 'video_processing_jobs',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = VideoProcessingJob;

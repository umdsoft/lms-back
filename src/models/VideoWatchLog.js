const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const VideoWatchLog = sequelize.define('VideoWatchLog', {
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
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'session_id',
  },
  startPosition: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'start_position',
  },
  endPosition: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'end_position',
  },
  watchDuration: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'watch_duration',
  },
  quality: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  playbackRate: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 1.0,
    field: 'playback_rate',
  },
  deviceType: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'device_type',
  },
}, {
  tableName: 'video_watch_logs',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = VideoWatchLog;

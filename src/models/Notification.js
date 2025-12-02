const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Notification = sequelize.define('Notification', {
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
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'action_url',
  },
  actionType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'action_type',
  },
  referenceType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'reference_type',
  },
  referenceId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'reference_id',
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at',
  },
}, {
  tableName: 'notifications',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Notification;

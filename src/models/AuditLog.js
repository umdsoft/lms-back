const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'user_id',
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'event_type',
  },
  eventCategory: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'event_category',
  },
  targetType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'target_type',
  },
  targetId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'target_id',
  },
  oldValues: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'old_values',
  },
  newValues: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'new_values',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AuditLog;

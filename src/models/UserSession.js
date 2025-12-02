const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const UserSession = sequelize.define('UserSession', {
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
  deviceId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'device_id',
  },
  deviceType: {
    type: DataTypes.ENUM('web', 'mobile_android', 'mobile_ios', 'desktop'),
    defaultValue: 'web',
    field: 'device_type',
  },
  deviceName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'device_name',
  },
  browser: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  os: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  lastActiveAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_active_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
}, {
  tableName: 'user_sessions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = UserSession;

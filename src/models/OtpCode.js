const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const OtpCode = sequelize.define('OtpCode', {
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
  identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('sms', 'email'),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.ENUM('registration', 'login', 'password_reset', 'phone_verify', 'email_verify', 'bank_change'),
    allowNull: false,
  },
  attemptsLeft: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 3,
    field: 'attempts_left',
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_used',
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'used_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
}, {
  tableName: 'otp_codes',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = OtpCode;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const UserStreak = sequelize.define('UserStreak', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  currentStreak: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'current_streak',
  },
  longestStreak: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'longest_streak',
  },
  lastActivityDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'last_activity_date',
  },
  freezeAvailable: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 2,
    field: 'freeze_available',
  },
  freezeUsedThisMonth: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    field: 'freeze_used_this_month',
  },
  totalActiveDays: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_active_days',
  },
}, {
  tableName: 'user_streaks',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = UserStreak;

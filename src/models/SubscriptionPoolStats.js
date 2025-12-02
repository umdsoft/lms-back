const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const SubscriptionPoolStats = sequelize.define('SubscriptionPoolStats', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  period: {
    type: DataTypes.STRING(7),
    allowNull: false,
    unique: true,
  },
  totalPoolAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'total_pool_amount',
  },
  totalWatchMinutes: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'total_watch_minutes',
  },
  distributedAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'distributed_amount',
  },
  teachersCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'teachers_count',
  },
  status: {
    type: DataTypes.ENUM('collecting', 'calculating', 'distributed'),
    defaultValue: 'collecting',
  },
  calculatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'calculated_at',
  },
  distributedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'distributed_at',
  },
}, {
  tableName: 'subscription_pool_stats',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SubscriptionPoolStats;

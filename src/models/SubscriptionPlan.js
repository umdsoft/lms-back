const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'UZS',
  },
  durationDays: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'duration_days',
  },
  durationType: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    allowNull: false,
    field: 'duration_type',
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  maxCourses: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'max_courses',
  },
  maxDownloads: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'max_downloads',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
  },
  trialDays: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'trial_days',
  },
}, {
  tableName: 'subscription_plans',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = SubscriptionPlan;

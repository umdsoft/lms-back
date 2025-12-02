const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Enrollment = sequelize.define('Enrollment', {
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
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'course_id',
  },
  enrollmentType: {
    type: DataTypes.ENUM('purchase', 'subscription', 'free', 'gift', 'promo'),
    allowNull: false,
    field: 'enrollment_type',
  },
  paymentId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'payment_id',
  },
  subscriptionId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'subscription_id',
  },
  pricePaid: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'price_paid',
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'UZS',
  },
  progress: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
  },
  completedLessons: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'completed_lessons',
  },
  totalWatchTime: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_watch_time',
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'expired', 'refunded'),
    defaultValue: 'active',
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at',
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_accessed_at',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
}, {
  tableName: 'enrollments',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Enrollment;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TeacherEarning = sequelize.define('TeacherEarning', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  teacherId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'teacher_id',
  },
  type: {
    type: DataTypes.ENUM('course_sale', 'subscription_pool'),
    allowNull: false,
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'course_id',
  },
  enrollmentId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'enrollment_id',
  },
  period: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
  grossAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'gross_amount',
  },
  commissionRate: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    field: 'commission_rate',
  },
  commissionAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'commission_amount',
  },
  netAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'net_amount',
  },
  watchMinutes: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'watch_minutes',
  },
  poolPercentage: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    field: 'pool_percentage',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'cancelled'),
    defaultValue: 'pending',
  },
  payoutId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'payout_id',
  },
}, {
  tableName: 'teacher_earnings',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TeacherEarning;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Review = sequelize.define('Review', {
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
  enrollmentId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'enrollment_id',
  },
  rating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pros: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  cons: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  teacherResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'teacher_response',
  },
  teacherRespondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'teacher_responded_at',
  },
  helpfulCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'helpful_count',
  },
  notHelpfulCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'not_helpful_count',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'hidden'),
    defaultValue: 'pending',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  },
  isVerifiedPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_verified_purchase',
  },
}, {
  tableName: 'reviews',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Review;

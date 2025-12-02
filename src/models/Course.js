const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  directionId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'direction_id',
  },
  teacherId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'teacher_id',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'short_description',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'thumbnail_url',
  },
  previewVideoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'preview_video_url',
  },
  price: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  originalPrice: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'original_price',
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_free',
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  language: {
    type: DataTypes.ENUM('uz', 'ru', 'en'),
    defaultValue: 'uz',
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  whatYouLearn: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'what_you_learn',
  },
  targetAudience: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'target_audience',
  },
  modulesCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'modules_count',
  },
  lessonsCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'lessons_count',
  },
  totalDuration: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_duration',
  },
  studentsCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'students_count',
  },
  reviewsCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'reviews_count',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
  },
  completionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    field: 'completion_rate',
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'revision', 'approved', 'published', 'unpublished', 'rejected'),
    defaultValue: 'draft',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submitted_at',
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reviewed_at',
  },
  reviewedBy: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'reviewed_by',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at',
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
  },
  isBestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_bestseller',
  },
}, {
  tableName: 'courses',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Course;

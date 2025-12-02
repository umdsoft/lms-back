const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TeacherProfile = sequelize.define('TeacherProfile', {
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
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  headline: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  specializations: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  websiteUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'website_url',
  },
  youtubeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'youtube_url',
  },
  telegramUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'telegram_url',
  },
  linkedinUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'linkedin_url',
  },
  level: {
    type: DataTypes.ENUM('new', 'verified', 'featured', 'top'),
    defaultValue: 'new',
  },
  commissionRate: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 30.00,
    field: 'commission_rate',
  },
  totalStudents: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_students',
  },
  totalCourses: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_courses',
  },
  totalReviews: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'total_reviews',
  },
  avgRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    field: 'avg_rating',
  },
  totalEarnings: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'total_earnings',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verified_at',
  },
  verifiedBy: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'verified_by',
  },
}, {
  tableName: 'teacher_profiles',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = TeacherProfile;

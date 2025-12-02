const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Certificate = sequelize.define('Certificate', {
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
  certificateNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'certificate_number',
  },
  recipientName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'recipient_name',
  },
  courseTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'course_title',
  },
  instructorName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'instructor_name',
  },
  finalScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'final_score',
  },
  totalHours: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'total_hours',
  },
  pdfUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'pdf_url',
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
  },
  verificationUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'verification_url',
  },
  qrCodeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'qr_code_url',
  },
  issuedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'issued_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
}, {
  tableName: 'certificates',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Certificate;

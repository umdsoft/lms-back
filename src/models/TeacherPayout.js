const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TeacherPayout = sequelize.define('TeacherPayout', {
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
  bankAccountId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'bank_account_id',
  },
  periodStart: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'period_start',
  },
  periodEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'period_end',
  },
  grossAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'gross_amount',
  },
  deductions: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
  netAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'net_amount',
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'transaction_id',
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'transaction_date',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'failure_reason',
  },
  processedBy: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'processed_by',
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'processed_at',
  },
}, {
  tableName: 'teacher_payouts',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TeacherPayout;

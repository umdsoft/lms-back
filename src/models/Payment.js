const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Payment = sequelize.define('Payment', {
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
  type: {
    type: DataTypes.ENUM('course_purchase', 'subscription', 'renewal'),
    allowNull: false,
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'course_id',
  },
  subscriptionId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'subscription_id',
  },
  amount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'UZS',
  },
  originalAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'original_amount',
  },
  discountAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'discount_amount',
  },
  promoCodeId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'promo_code_id',
  },
  provider: {
    type: DataTypes.ENUM('payme', 'click', 'uzcard', 'manual'),
    allowNull: false,
  },
  providerTransactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'provider_transaction_id',
  },
  providerResponse: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'provider_response',
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending',
  },
  refundAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'refund_amount',
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refunded_at',
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'refund_reason',
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent',
  },
}, {
  tableName: 'payments',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Payment;

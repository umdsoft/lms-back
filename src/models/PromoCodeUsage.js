const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const PromoCodeUsage = sequelize.define('PromoCodeUsage', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  promoCodeId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'promo_code_id',
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'user_id',
  },
  paymentId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'payment_id',
  },
  discountAmount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    field: 'discount_amount',
  },
  usedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'used_at',
  },
}, {
  tableName: 'promo_code_usage',
  underscored: true,
  timestamps: false,
});

module.exports = PromoCodeUsage;

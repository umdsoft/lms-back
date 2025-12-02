const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const PromoCode = sequelize.define('PromoCode', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_course', 'trial_extension'),
    allowNull: false,
  },
  value: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  maxDiscount: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'max_discount',
  },
  minPurchase: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    field: 'min_purchase',
  },
  usageLimit: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'usage_limit',
  },
  usagePerUser: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 1,
    field: 'usage_per_user',
  },
  usedCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'used_count',
  },
  applicableTo: {
    type: DataTypes.ENUM('all', 'courses', 'subscriptions', 'specific'),
    defaultValue: 'all',
    field: 'applicable_to',
  },
  applicableIds: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'applicable_ids',
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'valid_from',
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'valid_until',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  createdBy: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'created_by',
  },
}, {
  tableName: 'promo_codes',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = PromoCode;

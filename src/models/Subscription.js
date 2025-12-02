const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Subscription = sequelize.define('Subscription', {
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
  planId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'plan_id',
  },
  status: {
    type: DataTypes.ENUM('trial', 'active', 'past_due', 'cancelled', 'expired'),
    defaultValue: 'active',
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'trial_ends_at',
  },
  startsAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'starts_at',
  },
  endsAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'ends_at',
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_at',
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'auto_renew',
  },
  lastPaymentId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'last_payment_id',
  },
  nextPaymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'next_payment_date',
  },
  gracePeriodEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'grace_period_ends_at',
  },
}, {
  tableName: 'subscriptions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Subscription;

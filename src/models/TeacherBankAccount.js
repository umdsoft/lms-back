const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TeacherBankAccount = sequelize.define('TeacherBankAccount', {
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
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'bank_name',
  },
  accountNumberEncrypted: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'account_number_encrypted',
  },
  accountNumberLast4: {
    type: DataTypes.STRING(4),
    allowNull: true,
    field: 'account_number_last4',
  },
  cardHolderName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'card_holder_name',
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
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'teacher_bank_accounts',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = TeacherBankAccount;

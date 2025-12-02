const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_system',
  },
}, {
  tableName: 'roles',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = Role;

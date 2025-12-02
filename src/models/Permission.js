const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  groupName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'group_name',
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'permissions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Permission;

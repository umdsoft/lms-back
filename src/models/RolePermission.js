const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  roleId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'role_id',
  },
  permissionId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'permission_id',
  },
}, {
  tableName: 'role_permissions',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = RolePermission;

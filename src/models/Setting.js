const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  keyName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'key_name',
  },
  valueText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'value_text',
  },
  valueJson: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'value_json',
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
    defaultValue: 'string',
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
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public',
  },
}, {
  tableName: 'settings',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Helper method to get value based on type
Setting.prototype.getValue = function() {
  switch (this.type) {
    case 'json':
      return this.valueJson;
    case 'number':
      return parseFloat(this.valueText);
    case 'boolean':
      return this.valueText === 'true' || this.valueText === '1';
    default:
      return this.valueText;
  }
};

module.exports = Setting;

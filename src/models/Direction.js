const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Direction = sequelize.define('Direction', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Direction name already exists',
    },
    validate: {
      notEmpty: {
        msg: 'Direction name is required',
      },
      len: {
        args: [3, 100],
        msg: 'Direction name must be between 3 and 100 characters',
      },
    },
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Direction slug already exists',
    },
    validate: {
      notEmpty: {
        msg: 'Direction slug is required',
      },
      isLowercase: {
        msg: 'Slug must be lowercase',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Description cannot exceed 500 characters',
      },
    },
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Direction color is required',
      },
      isIn: {
        args: [['blue', 'purple', 'orange', 'green', 'red', 'indigo', 'pink', 'yellow', 'teal', 'cyan']],
        msg: 'Color must be one of: blue, purple, orange, green, red, indigo, pink, yellow, teal, cyan',
      },
    },
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    field: 'display_order',
    validate: {
      min: {
        args: 0,
        msg: 'Display order must be at least 0',
      },
    },
  },
}, {
  tableName: 'directions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['slug'],
    },
  ],
});

module.exports = Direction;

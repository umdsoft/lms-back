const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  courseId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'course_id',
    references: {
      model: 'courses',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Module name is required',
      },
      len: {
        args: [3, 200],
        msg: 'Module name must be between 3 and 200 characters',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Order must be non-negative',
      },
    },
    comment: 'Display order, sortable',
  },
}, {
  tableName: 'modules',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['course_id'],
    },
    {
      fields: ['course_id', 'order'],
    },
  ],
});

// Override toJSON to ensure camelCase response format
Module.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // Convert snake_case timestamps to camelCase
  if (values.created_at) {
    values.createdAt = values.created_at;
    delete values.created_at;
  }
  if (values.updated_at) {
    values.updatedAt = values.updated_at;
    delete values.updated_at;
  }

  return values;
};

module.exports = Module;

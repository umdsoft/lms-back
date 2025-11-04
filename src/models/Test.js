const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  lessonId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'lesson_id',
    references: {
      model: 'lessons',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Test name is required',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 600,
    field: 'time_limit',
    validate: {
      min: {
        args: [0],
        msg: 'Time limit must be non-negative',
      },
    },
    comment: 'Time limit in seconds',
  },
  passingScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 70,
    field: 'passing_score',
    validate: {
      min: {
        args: [0],
        msg: 'Passing score must be between 0 and 100',
      },
      max: {
        args: [100],
        msg: 'Passing score must be between 0 and 100',
      },
    },
    comment: 'Passing score in percentage',
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive'),
    allowNull: false,
    defaultValue: 'draft',
  },
}, {
  tableName: 'tests',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['lesson_id'],
    },
    {
      fields: ['status'],
    },
  ],
});

// Override toJSON to ensure camelCase response format
Test.prototype.toJSON = function () {
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

module.exports = Test;

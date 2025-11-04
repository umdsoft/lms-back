const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  directionId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'direction_id',
    references: {
      model: 'directions',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Course name is required',
      },
      len: {
        args: [3, 200],
        msg: 'Course name must be between 3 and 200 characters',
      },
    },
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: {
      msg: 'Course slug already exists',
    },
    validate: {
      notEmpty: {
        msg: 'Course slug is required',
      },
      isLowercase: {
        msg: 'Slug must be lowercase',
      },
    },
  },
  level: {
    type: DataTypes.ENUM('beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficiency'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficiency']],
        msg: 'Invalid level',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Pricing
  pricingType: {
    type: DataTypes.ENUM('subscription', 'individual'),
    allowNull: false,
    defaultValue: 'subscription',
    field: 'pricing_type',
    comment: 'subscription = included in subscription, individual = sold separately',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be non-negative',
      },
      priceRequiredForIndividual(value) {
        if (this.pricingType === 'individual' && (!value || value <= 0)) {
          throw new Error('Price is required for individual pricing type');
        }
      },
    },
    comment: 'Price in UZS, only for individual pricing type',
  },
  // Teacher (optional)
  teacherId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'teacher_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  // Thumbnail
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Thumbnail must be a valid URL',
      },
    },
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive'),
    allowNull: false,
    defaultValue: 'draft',
  },
}, {
  tableName: 'courses',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['direction_id'],
    },
    {
      fields: ['teacher_id'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['slug'],
      unique: true,
    },
    {
      fields: ['pricing_type'],
    },
  ],
});

// Override toJSON to ensure camelCase response format
Course.prototype.toJSON = function () {
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

module.exports = Course;

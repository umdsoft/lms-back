const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DirectionTeacher = sequelize.define('DirectionTeacher', {
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
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'direction_teachers',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['direction_id', 'user_id'],
      name: 'unique_direction_teacher',
    },
    {
      fields: ['direction_id'],
    },
    {
      fields: ['user_id'],
    },
  ],
});

module.exports = DirectionTeacher;

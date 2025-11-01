const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DirectionSubject = sequelize.define('DirectionSubject', {
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
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Subject name is required',
      },
      len: {
        args: [2, 100],
        msg: 'Subject name must be between 2 and 100 characters',
      },
    },
  },
}, {
  tableName: 'direction_subjects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['direction_id'],
    },
  ],
});

module.exports = DirectionSubject;

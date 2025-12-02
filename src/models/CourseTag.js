const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const CourseTag = sequelize.define('CourseTag', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'course_id',
  },
  tagId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'tag_id',
  },
}, {
  tableName: 'course_tags',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = CourseTag;

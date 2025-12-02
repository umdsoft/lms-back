const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const ReviewVote = sequelize.define('ReviewVote', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  reviewId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'review_id',
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'user_id',
  },
  vote: {
    type: DataTypes.ENUM('helpful', 'not_helpful'),
    allowNull: false,
  },
}, {
  tableName: 'review_votes',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ReviewVote;

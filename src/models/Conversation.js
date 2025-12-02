const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  participant1Id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'participant1_id',
  },
  participant2Id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'participant2_id',
  },
  courseId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'course_id',
  },
  lastMessageId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    field: 'last_message_id',
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_message_at',
  },
  participant1Unread: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'participant1_unread',
  },
  participant2Unread: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    field: 'participant2_unread',
  },
}, {
  tableName: 'conversations',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Conversation;

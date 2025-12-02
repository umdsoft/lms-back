const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  conversationId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'conversation_id',
  },
  senderId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'sender_id',
  },
  messageText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'message_text',
  },
  attachmentUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'attachment_url',
  },
  attachmentType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'attachment_type',
  },
  attachmentName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'attachment_name',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read',
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at',
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_edited',
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'edited_at',
  },
}, {
  tableName: 'messages',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at',
});

module.exports = Message;

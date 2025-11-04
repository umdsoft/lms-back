const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  moduleId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'module_id',
    references: {
      model: 'modules',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Lesson name is required',
      },
      len: {
        args: [3, 200],
        msg: 'Lesson name must be between 3 and 200 characters',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Video
  videoType: {
    type: DataTypes.ENUM('youtube', 'direct'),
    allowNull: false,
    defaultValue: 'youtube',
    field: 'video_type',
    comment: 'youtube = YouTube video, direct = direct video URL',
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'video_url',
    validate: {
      notEmpty: {
        msg: 'Video URL is required',
      },
      isUrl: {
        msg: 'Video URL must be valid',
      },
    },
  },
  videoEmbedUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'video_embed_url',
    comment: 'Auto-generated YouTube embed URL or direct URL',
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Duration must be non-negative',
      },
    },
    comment: 'Duration in seconds, manually entered',
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
    comment: 'Display order within module',
  },
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['module_id'],
    },
    {
      fields: ['module_id', 'order'],
    },
  ],
  hooks: {
    beforeValidate: async (lesson) => {
      // Auto-process video URL if not already set
      if (lesson.videoUrl && !lesson.videoEmbedUrl) {
        const { processVideoUrl } = require('../utils/videoProcessor');
        const processed = processVideoUrl(lesson.videoUrl);
        lesson.videoType = processed.type;
        lesson.videoEmbedUrl = processed.embedUrl;
      }
    },
  },
});

// Override toJSON to ensure camelCase response format
Lesson.prototype.toJSON = function () {
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

module.exports = Lesson;

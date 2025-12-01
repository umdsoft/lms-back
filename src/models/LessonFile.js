const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LessonFile = sequelize.define('LessonFile', {
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
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'File name is required',
      },
    },
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'original_name',
    comment: 'Original file name from user',
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_name',
    comment: 'UUID-based file name on server',
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'file_path',
    comment: 'Full file path on server',
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'File URL is required',
      },
    },
  },
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'file_type',
    comment: 'MIME type (application/pdf, image/jpeg, etc)',
  },
  fileExtension: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'file_extension',
    comment: 'File extension (.pdf, .docx, etc)',
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'file_size',
    comment: 'File size in bytes',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
    comment: 'Display order for sorting',
  },
  downloadCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    field: 'download_count',
    comment: 'Number of times file has been downloaded',
  },
}, {
  tableName: 'lesson_files',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['lesson_id'],
    },
    {
      fields: ['lesson_id', 'display_order'],
    },
  ],
});

// Virtual getter for file URL
LessonFile.prototype.getFileUrl = function() {
  if (this.fileName) {
    return `/uploads/lessons/${this.fileName}`;
  }
  return this.url;
};

// Format file size for display
LessonFile.prototype.getFormattedSize = function() {
  const bytes = this.fileSize;
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Override toJSON to ensure camelCase response format
LessonFile.prototype.toJSON = function () {
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

  // Add formatted size
  values.formattedSize = this.getFormattedSize();
  // Add file URL
  values.fileUrl = this.getFileUrl();
  // Add download URL
  values.downloadUrl = `/api/v1/lesson-files/${this.id}/download`;

  return values;
};

module.exports = LessonFile;

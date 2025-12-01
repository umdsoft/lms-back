const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LessonTest = sequelize.define('LessonTest', {
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
  question: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Question is required',
      },
      len: {
        args: [3, 1000],
        msg: 'Question must be between 3 and 1000 characters',
      },
    },
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidOptions(value) {
        if (!Array.isArray(value)) {
          throw new Error('Options must be an array');
        }
        if (value.length < 2 || value.length > 6) {
          throw new Error('Options must have between 2 and 6 items');
        }
      },
    },
    comment: 'Answer options as JSON array',
  },
  correctOption: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'correct_option',
    validate: {
      min: {
        args: [0],
        msg: 'Correct option must be a valid index',
      },
    },
    comment: 'Index of correct answer (0-based)',
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Explanation for the correct answer',
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    defaultValue: 'medium',
    comment: 'Difficulty level',
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: {
        args: [1],
        msg: 'Points must be at least 1',
      },
    },
    comment: 'Points for correct answer',
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_limit',
    comment: 'Time limit in seconds (optional)',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
    comment: 'Display order for sorting',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
    comment: 'Whether test question is active',
  },
}, {
  tableName: 'lesson_tests',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['lesson_id'],
    },
    {
      fields: ['difficulty'],
    },
    {
      fields: ['is_active'],
    },
    {
      fields: ['lesson_id', 'display_order'],
    },
  ],
});

// Get difficulty color for UI
LessonTest.prototype.getDifficultyColor = function() {
  const colors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red',
  };
  return colors[this.difficulty] || 'gray';
};

// Get difficulty label in Uzbek
LessonTest.prototype.getDifficultyLabel = function() {
  const labels = {
    easy: 'Oson',
    medium: "O'rta",
    hard: 'Qiyin',
  };
  return labels[this.difficulty] || this.difficulty;
};

// Override toJSON to ensure camelCase response format
LessonTest.prototype.toJSON = function () {
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

  // Add difficulty color and label
  values.difficultyColor = this.getDifficultyColor();
  values.difficultyLabel = this.getDifficultyLabel();

  // Parse options if it's a string
  if (typeof values.options === 'string') {
    try {
      values.options = JSON.parse(values.options);
    } catch (e) {
      // Keep as is if parsing fails
    }
  }

  return values;
};

module.exports = LessonTest;

const { Op } = require('sequelize');
const { Direction, DirectionSubject, DirectionTeacher, User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const logger = require('../config/logger');

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

class DirectionService {
  /**
   * Get all directions with filtering, pagination, and search
   */
  async getDirections(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status,
        sortBy = 'displayOrder',
        sortOrder = 'asc',
      } = filters;

      // Build where clause
      const whereClause = {};

      // Search by name or description
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Filter by status
      if (status && ['active', 'inactive'].includes(status)) {
        whereClause.status = status;
      }

      // Calculate offset
      const offset = (page - 1) * limit;

      // Fetch directions with pagination
      const { count, rows: directions } = await Direction.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        include: [
          {
            model: DirectionSubject,
            as: 'subjects',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'teachers',
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
            through: { attributes: [] }, // Exclude junction table attributes
          },
        ],
      });

      // Add statistics for each direction
      const directionsWithStats = directions.map((direction) => {
        const directionData = direction.toJSON();
        // For now, mock stats - will be real when courses/enrollments are added
        directionData.stats = {
          totalStudents: 0,
          totalCourses: 0,
        };
        return directionData;
      });

      // Calculate overall statistics
      const statistics = await this.getStatistics();

      return {
        directions: directionsWithStats,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
        statistics,
      };
    } catch (error) {
      logger.error('Error getting all directions:', error);
      throw error;
    }
  }

  /**
   * Get direction by ID
   */
  async getDirectionById(directionId) {
    try {
      const direction = await Direction.findByPk(directionId, {
        include: [
          {
            model: DirectionSubject,
            as: 'subjects',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'teachers',
            attributes: ['id', 'firstName', 'lastName', 'avatar', 'email'],
            through: { attributes: [] },
          },
        ],
      });

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const directionData = direction.toJSON();
      // Add mock stats for now
      directionData.stats = {
        totalStudents: 0,
        totalCourses: 0,
      };

      return directionData;
    } catch (error) {
      logger.error(`Error getting direction by ID ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Create new direction
   */
  async createDirection(data, createdBy) {
    try {
      const { name, description, color, icon, status, displayOrder } = data;

      const normalizedDisplayOrder =
        displayOrder !== undefined && displayOrder !== null && displayOrder !== ''
          ? Number(displayOrder)
          : undefined;

      if (normalizedDisplayOrder !== undefined && Number.isNaN(normalizedDisplayOrder)) {
        throw new AppError('Display order must be an integer.', 400);
      }

      // Generate slug from name
      const slug = generateSlug(name);

      // Check if direction with same name or slug already exists
      const existingDirection = await Direction.findOne({
        where: {
          [Op.or]: [{ name }, { slug }],
        },
      });

      if (existingDirection) {
        if (existingDirection.name === name) {
          throw new AppError('Direction with this name already exists', 409);
        }
        if (existingDirection.slug === slug) {
          throw new AppError('Direction with this slug already exists', 409);
        }
      }

      // Create direction
      const direction = await Direction.create({
        name,
        slug,
        description,
        color,
        icon,
        status: status || 'active',
        displayOrder: normalizedDisplayOrder ?? 0,
      });

      // Log action
      logger.info(`Direction created: ${name} by ${createdBy}`);

      // Return with associations
      return await this.getDirectionById(direction.id);
    } catch (error) {
      logger.error('Error creating direction:', error);
      throw error;
    }
  }

  /**
   * Update direction
   */
  async updateDirection(directionId, updateData, updatedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const { name, description, color, icon, status, displayOrder } = updateData;

      // Track changed fields
      const changedFields = [];

      // If name changed, regenerate slug and check uniqueness
      if (name && name !== direction.name) {
        const newSlug = generateSlug(name);

        // Check if new name or slug already exists
        const existingDirection = await Direction.findOne({
          where: {
            [Op.or]: [{ name }, { slug: newSlug }],
            id: { [Op.ne]: directionId },
          },
        });

        if (existingDirection) {
          if (existingDirection.name === name) {
            throw new AppError('Direction with this name already exists', 409);
          }
          if (existingDirection.slug === newSlug) {
            throw new AppError('Direction with this slug already exists', 409);
          }
        }

        direction.name = name;
        direction.slug = newSlug;
        changedFields.push('name', 'slug');
      }

      // Update other fields
      if (description !== undefined && description !== direction.description) {
        direction.description = description;
        changedFields.push('description');
      }
      if (color !== undefined && color !== direction.color) {
        direction.color = color;
        changedFields.push('color');
      }
      if (icon !== undefined && icon !== direction.icon) {
        direction.icon = icon;
        changedFields.push('icon');
      }
      if (status !== undefined && status !== direction.status) {
        direction.status = status;
        changedFields.push('status');
      }
      if (displayOrder !== undefined && displayOrder !== direction.displayOrder) {
        const updatedDisplayOrder = Number(displayOrder);

        if (Number.isNaN(updatedDisplayOrder)) {
          throw new AppError('Display order must be an integer.', 400);
        }

        direction.displayOrder = updatedDisplayOrder;
        changedFields.push('displayOrder');
      }

      await direction.save();

      // Log action
      logger.info(
        `Direction updated: ${direction.name}, fields: [${changedFields.join(', ')}] by ${updatedBy}`
      );

      // Return with associations
      return await this.getDirectionById(direction.id);
    } catch (error) {
      logger.error(`Error updating direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Update direction status only
   */
  async updateDirectionStatus(directionId, newStatus, updatedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      // Validate status
      if (!['active', 'inactive'].includes(newStatus)) {
        throw new AppError('Invalid status', 400);
      }

      direction.status = newStatus;
      await direction.save();

      // Log action
      logger.info(
        `Direction status updated: ${direction.name}, new status: ${newStatus} by ${updatedBy}`
      );

      return await this.getDirectionById(direction.id);
    } catch (error) {
      logger.error(`Error updating direction status ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete direction
   */
  async deleteDirection(directionId, deletedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      // TODO: Check if has active courses (when Course model is implemented)
      // const activeCourses = await Course.count({
      //   where: { directionId, status: 'active' }
      // });
      // if (activeCourses > 0) {
      //   throw new AppError('Cannot delete direction with active courses', 400);
      // }

      const directionName = direction.name;

      // Delete direction (cascade delete will handle subjects and teachers)
      await direction.destroy();

      // Log action
      logger.info(`Direction deleted: ${directionName} by ${deletedBy}`);

      return { message: 'Direction deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Get direction statistics
   */
  async getStatistics() {
    try {
      const total = await Direction.count();
      const active = await Direction.count({ where: { status: 'active' } });
      const inactive = await Direction.count({ where: { status: 'inactive' } });

      // Mock stats for students and courses - will be real when those models exist
      const totalStudents = 0;
      const totalCourses = 0;

      return {
        total,
        active,
        inactive,
        totalStudents,
        totalCourses,
      };
    } catch (error) {
      logger.error('Error getting direction statistics:', error);
      throw error;
    }
  }

  /**
   * Get subjects for a direction
   */
  async getDirectionSubjects(directionId) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const subjects = await DirectionSubject.findAll({
        where: { directionId },
        attributes: ['id', 'name', 'createdAt'],
        order: [['name', 'ASC']],
      });

      return subjects;
    } catch (error) {
      logger.error(`Error getting subjects for direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Add subjects to direction
   */
  async addSubjects(directionId, subjectNames, addedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      if (!Array.isArray(subjectNames) || subjectNames.length === 0) {
        throw new AppError('Subjects array is required and cannot be empty', 400);
      }

      // Get existing subjects to avoid duplicates
      const existingSubjects = await DirectionSubject.findAll({
        where: { directionId },
        attributes: ['name'],
      });

      const existingNames = existingSubjects.map((s) => s.name.toLowerCase());

      // Filter out duplicates
      const newSubjectNames = subjectNames.filter(
        (name) => !existingNames.includes(name.toLowerCase())
      );

      if (newSubjectNames.length === 0) {
        throw new AppError('All subjects already exist for this direction', 409);
      }

      // Bulk create subjects
      const subjects = await DirectionSubject.bulkCreate(
        newSubjectNames.map((name) => ({
          directionId,
          name,
        }))
      );

      // Log action
      logger.info(
        `Subjects added to ${direction.name}: [${newSubjectNames.join(', ')}] by ${addedBy}`
      );

      return subjects;
    } catch (error) {
      logger.error(`Error adding subjects to direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Remove subject from direction
   */
  async removeSubject(directionId, subjectId, removedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const subject = await DirectionSubject.findOne({
        where: { id: subjectId, directionId },
      });

      if (!subject) {
        throw new AppError('Subject not found in this direction', 404);
      }

      const subjectName = subject.name;
      await subject.destroy();

      // Log action
      logger.info(
        `Subject removed from ${direction.name}: ${subjectName} by ${removedBy}`
      );

      return { message: 'Subject removed successfully' };
    } catch (error) {
      logger.error(`Error removing subject ${subjectId} from direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Get teachers for a direction
   */
  async getDirectionTeachers(directionId) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const teachers = await User.findAll({
        include: [
          {
            model: Direction,
            as: 'directions',
            where: { id: directionId },
            through: { attributes: [] },
            attributes: [],
          },
        ],
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      });

      return teachers;
    } catch (error) {
      logger.error(`Error getting teachers for direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Assign teachers to direction
   */
  async assignTeachers(directionId, teacherIds, assignedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
        throw new AppError('Teacher IDs array is required and cannot be empty', 400);
      }

      // Validate that all users exist and are teachers
      const users = await User.findAll({
        where: { id: teacherIds },
      });

      if (users.length !== teacherIds.length) {
        throw new AppError('One or more users not found', 404);
      }

      const nonTeachers = users.filter((user) => user.role !== 'teacher');
      if (nonTeachers.length > 0) {
        throw new AppError(
          `Users with IDs [${nonTeachers.map((u) => u.id).join(', ')}] are not teachers`,
          400
        );
      }

      // Get existing teacher assignments to avoid duplicates
      const existingAssignments = await DirectionTeacher.findAll({
        where: { directionId },
        attributes: ['userId'],
      });

      const existingTeacherIds = existingAssignments.map((a) => a.userId);

      // Filter out already assigned teachers
      const newTeacherIds = teacherIds.filter((id) => !existingTeacherIds.includes(id));

      if (newTeacherIds.length === 0) {
        throw new AppError('All teachers are already assigned to this direction', 409);
      }

      // Bulk create assignments
      await DirectionTeacher.bulkCreate(
        newTeacherIds.map((userId) => ({
          directionId,
          userId,
        }))
      );

      // Get teacher names for logging
      const newTeachers = users.filter((u) => newTeacherIds.includes(u.id));
      const teacherNames = newTeachers.map(
        (t) => `${t.firstName.charAt(0)}${t.lastName.charAt(0)}`
      );

      // Log action
      logger.info(
        `Teachers assigned to ${direction.name}: [${teacherNames.join(', ')}] by ${assignedBy}`
      );

      return await this.getDirectionTeachers(directionId);
    } catch (error) {
      logger.error(`Error assigning teachers to direction ${directionId}:`, error);
      throw error;
    }
  }

  /**
   * Remove teacher from direction
   */
  async removeTeacher(directionId, teacherId, removedBy) {
    try {
      const direction = await Direction.findByPk(directionId);

      if (!direction) {
        throw new AppError('Direction not found', 404);
      }

      const assignment = await DirectionTeacher.findOne({
        where: { directionId, userId: teacherId },
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['firstName', 'lastName'],
          },
        ],
      });

      if (!assignment) {
        throw new AppError('Teacher not assigned to this direction', 404);
      }

      const teacherName = `${assignment.teacher.firstName} ${assignment.teacher.lastName}`;
      await assignment.destroy();

      // Log action
      logger.info(
        `Teacher removed from ${direction.name}: ${teacherName} by ${removedBy}`
      );

      return { message: 'Teacher removed successfully' };
    } catch (error) {
      logger.error(`Error removing teacher ${teacherId} from direction ${directionId}:`, error);
      throw error;
    }
  }
}

module.exports = new DirectionService();

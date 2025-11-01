const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { AppError } = require('../middlewares/error.middleware');
const logger = require('../config/logger');

class UserService {
  /**
   * Get all users with filtering, pagination, and search
   */
  async getAllUsers(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        role,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      // Build where clause
      const whereClause = {};

      // Search by email, firstName, lastName
      if (search) {
        whereClause[Op.or] = [
          { email: { [Op.like]: `%${search}%` } },
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
        ];
      }

      // Filter by role
      if (role && ['student', 'teacher', 'admin'].includes(role)) {
        whereClause.role = role;
      }

      // Filter by status
      if (status && ['active', 'inactive', 'blocked'].includes(status)) {
        whereClause.status = status;
      }

      // Calculate offset
      const offset = (page - 1) * limit;

      // Fetch users with pagination
      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        attributes: { exclude: ['password'] },
      });

      // Calculate statistics
      const statistics = await this.getUserStatistics();

      return {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
        statistics,
      };
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      logger.error(`Error getting user by ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData, createdBy) {
    try {
      const { email, password, firstName, lastName, role, phone, status } = userData;

      // Check if email already exists
      if (email) {
        const existingUser = await User.findOne({
          where: { email: email.toLowerCase() }
        });
        if (existingUser) {
          throw new AppError('Email already exists', 409);
        }
      }

      // Check if phone already exists
      if (phone) {
        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) {
          throw new AppError('Phone number already exists', 409);
        }
      }

      // Create user
      const user = await User.create({
        email: email ? email.toLowerCase() : null,
        password,
        firstName,
        lastName,
        role: role || 'student',
        phone,
        status: status || 'active',
      });

      // Log action
      logger.info(`User created: ${email || phone} by ${createdBy}`);

      // Return user without password
      return user.toJSON();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData, updatedBy, isAdmin = false) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { firstName, lastName, phone, email, avatar } = updateData;

      // Check if email is being changed and if it already exists
      if (email && email.toLowerCase() !== user.email) {
        const existingUser = await User.findOne({
          where: { email: email.toLowerCase() }
        });
        if (existingUser) {
          throw new AppError('Email already exists', 409);
        }
      }

      // Check if phone is being changed and if it already exists
      if (phone && phone !== user.phone) {
        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) {
          throw new AppError('Phone number already exists', 409);
        }
      }

      // Track changed fields
      const changedFields = [];

      // Update allowed fields
      if (firstName !== undefined && firstName !== user.firstName) {
        user.firstName = firstName;
        changedFields.push('firstName');
      }
      if (lastName !== undefined && lastName !== user.lastName) {
        user.lastName = lastName;
        changedFields.push('lastName');
      }
      if (phone !== undefined && phone !== user.phone) {
        user.phone = phone;
        changedFields.push('phone');
      }
      if (email !== undefined && email.toLowerCase() !== user.email) {
        user.email = email.toLowerCase();
        changedFields.push('email');
      }
      if (avatar !== undefined && avatar !== user.avatar) {
        user.avatar = avatar;
        changedFields.push('avatar');
      }

      await user.save();

      // Log action
      logger.info(
        `User updated: ${user.email || user.phone}, fields: [${changedFields.join(', ')}] by ${updatedBy}`
      );

      return user.toJSON();
    } catch (error) {
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId, newRole, updatedBy) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Validate role
      if (!['student', 'teacher', 'admin'].includes(newRole)) {
        throw new AppError('Invalid role', 400);
      }

      // Check if this is the last admin
      if (user.role === 'admin' && newRole !== 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
          throw new AppError(
            'Cannot change role. This is the last admin account.',
            400
          );
        }
      }

      user.role = newRole;
      await user.save();

      // Log action
      logger.info(
        `User role updated: ${user.email || user.phone}, new role: ${newRole} by ${updatedBy}`
      );

      return user.toJSON();
    } catch (error) {
      logger.error(`Error updating user role ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update user status (admin only)
   */
  async updateUserStatus(userId, newStatus, reason = null, updatedBy) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Validate status
      if (!['active', 'inactive', 'blocked'].includes(newStatus)) {
        throw new AppError('Invalid status', 400);
      }

      // Check if this is the last admin
      if (user.role === 'admin' && newStatus !== 'active') {
        const activeAdminCount = await User.count({
          where: {
            role: 'admin',
            status: 'active'
          }
        });
        if (activeAdminCount <= 1) {
          throw new AppError(
            'Cannot change status. This is the last active admin account.',
            400
          );
        }
      }

      user.status = newStatus;

      // Update blocked fields if status is blocked
      if (newStatus === 'blocked') {
        user.blockedAt = new Date();
        user.blockedReason = reason || 'No reason provided';
      } else {
        user.blockedAt = null;
        user.blockedReason = null;
      }

      await user.save();

      // Log action
      const logMessage = newStatus === 'blocked'
        ? `User blocked: ${user.email || user.phone}, reason: ${reason} by ${updatedBy}`
        : `User status updated: ${user.email || user.phone}, new status: ${newStatus} by ${updatedBy}`;

      logger.info(logMessage);

      return user.toJSON();
    } catch (error) {
      logger.error(`Error updating user status ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new AppError(
          'New password must be at least 8 characters long',
          400
        );
      }

      // Check password strength
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);

      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        throw new AppError(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
          400
        );
      }

      // Update password (will be hashed by model hook)
      user.password = newPassword;
      await user.save();

      // Log action
      logger.info(`Password changed for user: ${user.email || user.phone}`);

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error(`Error changing password for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete - set status to inactive)
   */
  async deleteUser(userId, deletedBy) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if this is the last admin
      if (user.role === 'admin') {
        const adminCount = await User.count({
          where: {
            role: 'admin',
            status: 'active'
          }
        });
        if (adminCount <= 1) {
          throw new AppError(
            'Cannot delete the last active admin account.',
            400
          );
        }
      }

      // Soft delete - set status to inactive
      user.status = 'inactive';
      user.isActive = false;
      await user.save();

      // Log action
      logger.info(`User deleted: ${user.email || user.phone} by ${deletedBy}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics() {
    try {
      const total = await User.count();
      const active = await User.count({ where: { status: 'active' } });
      const inactive = await User.count({ where: { status: 'inactive' } });
      const blocked = await User.count({ where: { status: 'blocked' } });

      const students = await User.count({ where: { role: 'student' } });
      const teachers = await User.count({ where: { role: 'teacher' } });
      const admins = await User.count({ where: { role: 'admin' } });

      return {
        total,
        active,
        inactive,
        blocked,
        byRole: {
          student: students,
          teacher: teachers,
          admin: admins,
        },
      };
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }
}

module.exports = new UserService();

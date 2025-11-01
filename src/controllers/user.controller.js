const userService = require('../services/user.service');
const { AppError } = require('../middlewares/error.middleware');

class UserController {
  /**
   * Get all users with filters
   * GET /api/v1/users
   * Admin only
   */
  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, role, status, sortBy, sortOrder } = req.query;

      const result = await userService.getAllUsers({
        page,
        limit,
        search,
        role,
        status,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single user by ID
   * GET /api/v1/users/:id
   * Admin or own profile
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      // Check if user can access this profile
      if (currentUser.role !== 'admin' && currentUser.id !== parseInt(id)) {
        throw new AppError(
          'You do not have permission to view this profile',
          403
        );
      }

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   * POST /api/v1/users
   * Admin only
   */
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const createdBy = req.user.email || req.user.phone;

      const user = await userService.createUser(userData, createdBy);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PUT /api/v1/users/:id
   * Admin or own profile (but cannot change role)
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const currentUser = req.user;
      const updateData = req.body;

      // Check if user can update this profile
      const isAdmin = currentUser.role === 'admin';
      const isOwnProfile = currentUser.id === parseInt(id);

      if (!isAdmin && !isOwnProfile) {
        throw new AppError(
          'You do not have permission to update this profile',
          403
        );
      }

      // Prevent non-admin from updating role
      if (!isAdmin && updateData.role) {
        throw new AppError(
          'You do not have permission to change user role',
          403
        );
      }

      const updatedBy = currentUser.email || currentUser.phone;
      const user = await userService.updateUser(id, updateData, updatedBy, isAdmin);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role
   * PATCH /api/v1/users/:id/role
   * Admin only
   */
  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const currentUser = req.user;

      // Prevent user from changing their own role
      if (currentUser.id === parseInt(id)) {
        throw new AppError('You cannot change your own role', 400);
      }

      if (!role) {
        throw new AppError('Role is required', 400);
      }

      const updatedBy = currentUser.email || currentUser.phone;
      const user = await userService.updateUserRole(id, role, updatedBy);

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user status
   * PATCH /api/v1/users/:id/status
   * Admin only
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const currentUser = req.user;

      // Prevent user from changing their own status
      if (currentUser.id === parseInt(id)) {
        throw new AppError('You cannot change your own status', 400);
      }

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      // Require reason for blocking
      if (status === 'blocked' && !reason) {
        throw new AppError('Reason is required when blocking a user', 400);
      }

      const updatedBy = currentUser.email || currentUser.phone;
      const user = await userService.updateUserStatus(id, status, reason, updatedBy);

      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * PATCH /api/v1/users/:id/password
   * User own profile only
   */
  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const currentUser = req.user;

      // Only allow user to change their own password
      if (currentUser.id !== parseInt(id)) {
        throw new AppError(
          'You can only change your own password',
          403
        );
      }

      if (!currentPassword || !newPassword) {
        throw new AppError(
          'Current password and new password are required',
          400
        );
      }

      await userService.changePassword(id, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/v1/users/:id
   * Admin only
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      // Prevent user from deleting themselves
      if (currentUser.id === parseInt(id)) {
        throw new AppError('You cannot delete your own account', 400);
      }

      const deletedBy = currentUser.email || currentUser.phone;
      await userService.deleteUser(id, deletedBy);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics
   * GET /api/v1/users/statistics
   * Admin only
   */
  async getStatistics(req, res, next) {
    try {
      const statistics = await userService.getUserStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

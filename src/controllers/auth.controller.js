const authService = require('../services/auth.service');
const ResponseUtil = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Authentication controller
 */
class AuthController {
  /**
   * Register a new user
   * @route POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);

      // Set session
      req.session.user = user;

      return ResponseUtil.success(
        res,
        user,
        'Registration successful',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * @route POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      // Set session
      req.session.user = user;

      return ResponseUtil.success(res, user, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * @route POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        res.clearCookie('connect.sid');
        return ResponseUtil.success(res, null, 'Logout successful');
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * @route GET /api/auth/me
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      return ResponseUtil.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get CSRF token
   * @route GET /api/auth/csrf-token
   */
  getCsrfToken(req, res) {
    return ResponseUtil.success(
      res,
      { csrfToken: req.session.csrfToken },
      'CSRF token retrieved successfully'
    );
  }

  /**
   * Update user profile
   * @route PUT /api/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      // Update session
      req.session.user = user;

      return ResponseUtil.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * @route PUT /api/profile/password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);

      return ResponseUtil.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

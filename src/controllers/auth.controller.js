const authService = require('../services/auth.service');
const { AppError } = require('../middlewares/error.middleware');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, phone, password, firstName, lastName, role } = req.body;

      const result = await authService.register({
        email,
        phone,
        password,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, phone, password } = req.body;

      // Use phone if provided, otherwise use email
      const identifier = phone || email;

      if (!identifier) {
        throw new AppError('Email or phone number is required.', 400);
      }

      const result = await authService.login(identifier, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required.', 400);
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required.', 400);
      }

      await authService.logout(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated.', 401);
      }

      await authService.logoutAll(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Logged out from all devices successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated.', 401);
      }

      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

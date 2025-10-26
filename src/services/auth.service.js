const { User, RefreshToken } = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} = require('../utils/jwt');
const { AppError } = require('../middlewares/error.middleware');

class AuthService {
  async register(email, password, firstName, lastName, role = 'student') {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new AppError('User with this email already exists.', 400);
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated.', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(token) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(token);

      // Check if refresh token exists in database
      const refreshTokenDoc = await RefreshToken.findOne({ where: { token } });

      if (!refreshTokenDoc) {
        throw new AppError('Invalid refresh token.', 401);
      }

      // Get user
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new AppError('User not found.', 401);
      }

      if (!user.isActive) {
        throw new AppError('User account is deactivated.', 401);
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Delete old refresh token and save new one
      await RefreshToken.destroy({ where: { token } });
      await RefreshToken.create({
        userId: user.id,
        token: newRefreshToken,
        expiresAt: getRefreshTokenExpiryDate(),
      });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid refresh token.', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token expired. Please login again.', 401);
      }
      throw error;
    }
  }

  async logout(token) {
    // Delete refresh token from database
    await RefreshToken.destroy({ where: { token } });
  }

  async logoutAll(userId) {
    // Delete all refresh tokens for user
    await RefreshToken.destroy({ where: { userId } });
  }
}

module.exports = new AuthService();

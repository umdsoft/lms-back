const userRepository = require('../repositories/user.repository');
const EncryptionUtil = require('../utils/encryption.util');
const logger = require('../config/logger');
const { ERROR_CODES } = require('../config/constants');

/**
 * Authentication service
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Created user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error(ERROR_CODES.CONFLICT);
      }

      // Hash password
      const hashedPassword = await EncryptionUtil.hashPassword(userData.password);

      // Create user
      const userId = await userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      // Fetch created user (without password)
      const user = await userRepository.findById(userId);
      delete user.password;

      logger.info(`User registered successfully: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Authenticated user
   */
  async login(email, password) {
    try {
      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        throw new Error(ERROR_CODES.UNAUTHORIZED);
      }

      // Verify password
      const isPasswordValid = await EncryptionUtil.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
      }

      // Update last login
      await userRepository.updateLastLogin(user.id);

      // Remove password from response
      delete user.password;

      logger.info(`User logged in successfully: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} User
   */
  async getUserById(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      delete user.password;
      return user;
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {object} updateData - Update data
   * @returns {Promise<object>} Updated user
   */
  async updateProfile(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated via this method
      delete updateData.password;
      delete updateData.role;
      delete updateData.email;

      await userRepository.update(userId, updateData);
      const user = await userRepository.findById(userId);
      delete user.password;

      logger.info(`User profile updated: ${userId}`);
      return user;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error(ERROR_CODES.NOT_FOUND);
      }

      // Verify current password
      const isPasswordValid = await EncryptionUtil.comparePassword(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
      }

      // Hash new password
      const hashedPassword = await EncryptionUtil.hashPassword(newPassword);

      // Update password
      await userRepository.update(userId, { password: hashedPassword });

      logger.info(`Password changed for user: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();

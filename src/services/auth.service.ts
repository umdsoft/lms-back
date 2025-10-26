import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { AuthResponse, TokenPayload } from '../types';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'student' | 'teacher' | 'admin' = 'student'
  ): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

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
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user._id.toString(),
      token: refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    });

    return {
      user: user.toJSON() as any,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

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
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user._id.toString(),
      token: refreshToken,
      expiresAt: getRefreshTokenExpiryDate(),
    });

    return {
      user: user.toJSON() as any,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(token: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(token);

      // Check if refresh token exists in database
      const refreshTokenDoc = await RefreshToken.findOne({ token });

      if (!refreshTokenDoc) {
        throw new AppError('Invalid refresh token.', 401);
      }

      // Get user
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError('User not found.', 401);
      }

      if (!user.isActive) {
        throw new AppError('User account is deactivated.', 401);
      }

      // Generate new tokens
      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Delete old refresh token and save new one
      await RefreshToken.deleteOne({ token });
      await RefreshToken.create({
        userId: user._id.toString(),
        token: newRefreshToken,
        expiresAt: getRefreshTokenExpiryDate(),
      });

      return {
        user: user.toJSON() as any,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if ((error as any).name === 'JsonWebTokenError') {
        throw new AppError('Invalid refresh token.', 401);
      }
      if ((error as any).name === 'TokenExpiredError') {
        throw new AppError('Refresh token expired. Please login again.', 401);
      }
      throw error;
    }
  }

  async logout(token: string): Promise<void> {
    // Delete refresh token from database
    await RefreshToken.deleteOne({ token });
  }

  async logoutAll(userId: string): Promise<void> {
    // Delete all refresh tokens for user
    await RefreshToken.deleteMany({ userId });
  }
}

export default new AuthService();

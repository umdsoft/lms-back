import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import User from '../models/User';
import { AppError } from './error.middleware';

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Please authenticate.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Invalid token format.', 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User not found. Token is invalid.', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated.', 401);
    }

    // Attach user to request
    req.user = user.toJSON() as any;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if ((error as any).name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please authenticate again.', 401));
    } else if ((error as any).name === 'TokenExpiredError') {
      next(new AppError('Token expired. Please refresh your token.', 401));
    } else {
      next(new AppError('Authentication failed.', 401));
    }
  }
};

// Middleware to check user role
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated.', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
};

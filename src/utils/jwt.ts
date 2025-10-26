import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '2d';

export const generateAccessToken = (payload: TokenPayload): string => {
  // @ts-expect-error - expiresIn type compatibility issue with jsonwebtoken
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  // @ts-expect-error - expiresIn type compatibility issue with jsonwebtoken
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

export const getRefreshTokenExpiryDate = (): Date => {
  // 2 days from now
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 2);
  return expiryDate;
};

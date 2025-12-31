import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from '../config/config.js';
import { JwtPayload } from '../types/index.js';
import { AppError } from './errors.js';

/**
 * Generate access token
 */
export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = config.jwt.expiresIn as SignOptions['expiresIn']
): string => {
  return jwt.sign(
    payload,
    config.jwt.secret as jwt.Secret,
    { expiresIn }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    config.jwt.refreshSecret as jwt.Secret,
    {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    }
  );
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(
      token,
      config.jwt.secret as jwt.Secret
    ) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'Token expired');
    }
    throw new AppError(401, 'Invalid authentication token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(
      token,
      config.jwt.refreshSecret as jwt.Secret
    ) as JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'Refresh token expired');
    }
    throw new AppError(401, 'Invalid refresh token');
  }
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare passwords
 */
export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Secure random token
 */
export const generateRandomToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

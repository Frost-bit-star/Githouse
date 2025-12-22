import { Router, Request, Response } from 'express';
import { asyncHandler, sendResponse, AppError } from '../utils/errors.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { UserService } from '../services/UserService.js';
import { generateToken, generateRefreshToken } from '../utils/auth.js';

const router = Router();

// Register
router.post(
  '/register',
  validateRequest(schemas.register),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.register(req.body);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    sendResponse(res, 201, true, 'User registered successfully', {
      user,
      token,
      refreshToken,
    });
  })
);

// Login
router.post(
  '/login',
  validateRequest(schemas.login),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.login(req.body);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    sendResponse(res, 200, true, 'Login successful', {
      user,
      token,
      refreshToken,
    });
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.user!.id);
    const stats = await UserService.getUserStats(req.user!.id);

    sendResponse(res, 200, true, 'User retrieved successfully', {
      user,
      stats,
    });
  })
);

// Get user by username
router.get(
  '/user/:username',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUserByUsername(req.params.username);
    const stats = await UserService.getUserStats(user.id);

    sendResponse(res, 200, true, 'User retrieved successfully', {
      user,
      stats,
    });
  })
);

// Update profile
router.put(
  '/me',
  authenticate,
  validateRequest(schemas.updateProfile),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateProfile(req.user!.id, req.body);

    sendResponse(res, 200, true, 'Profile updated successfully', user);
  })
);

export default router;

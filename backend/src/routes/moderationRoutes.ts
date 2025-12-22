import { Router, Request, Response } from 'express';
import { asyncHandler, sendResponse } from '../utils/errors.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ModerationService } from '../services/ModerationService.js';

const router = Router();

// Create moderation report
router.post(
  '/reports',
  authenticate,
  validateRequest(schemas.createModerationReport),
  asyncHandler(async (req: Request, res: Response) => {
    const report = await ModerationService.createReport(req.user!.id, req.body);

    sendResponse(res, 201, true, 'Report created successfully', report);
  })
);

// Get all reports (admin only)
router.get(
  '/reports',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const reports = await ModerationService.getAllReports(status);

    sendResponse(res, 200, true, 'Reports retrieved successfully', reports);
  })
);

// Get report by ID
router.get(
  '/reports/:reportId',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req: Request, res: Response) => {
    const report = await ModerationService.getReportById(req.params.reportId);

    sendResponse(res, 200, true, 'Report retrieved successfully', report);
  })
);

// Update report (admin only)
router.put(
  '/reports/:reportId',
  authenticate,
  authorize('admin'),
  validateRequest(schemas.updateModerationReport),
  asyncHandler(async (req: Request, res: Response) => {
    const report = await ModerationService.updateReport(req.params.reportId, req.body);

    sendResponse(res, 200, true, 'Report updated successfully', report);
  })
);

// Suspend user (admin only)
router.post(
  '/users/:userId/suspend',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const reason = req.body.reason || 'Violation of community guidelines';
    await ModerationService.suspendUser(req.params.userId, reason);

    sendResponse(res, 200, true, 'User suspended successfully');
  })
);

// Unsuspend user (admin only)
router.post(
  '/users/:userId/unsuspend',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: Request, res: Response) => {
    await ModerationService.unsuspendUser(req.params.userId);

    sendResponse(res, 200, true, 'User unsuspended successfully');
  })
);

export default router;

import { Router, Request, Response } from 'express';
import { asyncHandler, sendResponse } from '../utils/errors.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { CommunityService } from '../services/CommunityService.js';

const router = Router();

// Create community
router.post(
  '/',
  authenticate,
  validateRequest(schemas.createCommunity),
  asyncHandler(async (req: Request, res: Response) => {
    const community = await CommunityService.createCommunity(req.user!.id, req.body);

    sendResponse(res, 201, true, 'Community created successfully', community);
  })
);

// Get all communities
router.get(
  '/',
  validateRequest(schemas.pagination),
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await CommunityService.getCommunities(page, limit);

    sendResponse(res, 200, true, 'Communities retrieved successfully', result);
  })
);

// Get community by slug
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const community = await CommunityService.getCommunityBySlug(req.params.slug);

    sendResponse(res, 200, true, 'Community retrieved successfully', community);
  })
);

// Get community members
router.get(
  '/:slug/members',
  asyncHandler(async (req: Request, res: Response) => {
    const community = await CommunityService.getCommunityBySlug(req.params.slug);
    const members = await CommunityService.getCommunityMembers(community.id);

    sendResponse(res, 200, true, 'Members retrieved successfully', members);
  })
);

// Update community
router.put(
  '/:slug',
  authenticate,
  validateRequest(schemas.updateCommunity),
  asyncHandler(async (req: Request, res: Response) => {
    const community = await CommunityService.getCommunityBySlug(req.params.slug);
    const updated = await CommunityService.updateCommunity(community.id, req.user!.id, req.body);

    sendResponse(res, 200, true, 'Community updated successfully', updated);
  })
);

// Join community
router.post(
  '/:slug/join',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const community = await CommunityService.getCommunityBySlug(req.params.slug);
    await CommunityService.addMember(community.id, req.user!.id);

    sendResponse(res, 200, true, 'Joined community successfully');
  })
);

export default router;

import { Router, Request, Response } from 'express';
import { asyncHandler, sendResponse } from '../utils/errors.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { ProjectService } from '../services/ProjectService.js';

const router = Router();

// Create project
router.post(
  '/',
  authenticate,
  validateRequest(schemas.createProject),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await ProjectService.createProject(req.user!.id, req.body);

    sendResponse(res, 201, true, 'Project created successfully', project);
  })
);

// Get all projects
router.get(
  '/',
  validateRequest(schemas.pagination),
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await ProjectService.getProjects(page, limit);

    sendResponse(res, 200, true, 'Projects retrieved successfully', result);
  })
);

// Get project by slug
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const project = await ProjectService.getProjectBySlug(req.params.slug);

    sendResponse(res, 200, true, 'Project retrieved successfully', project);
  })
);

// Update project
router.put(
  '/:slug',
  authenticate,
  validateRequest(schemas.updateProject),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await ProjectService.getProjectBySlug(req.params.slug);
    const updated = await ProjectService.updateProject(project.id, req.user!.id, req.body);

    sendResponse(res, 200, true, 'Project updated successfully', updated);
  })
);

export default router;

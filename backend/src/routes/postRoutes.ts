import { Router, Request, Response } from 'express';
import { asyncHandler, sendResponse } from '../utils/errors.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { PostService } from '../services/PostService.js';

const router = Router();

// Create post
router.post(
  '/',
  authenticate,
  validateRequest(schemas.createPost),
  asyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.createPost(req.user!.id, req.body);

    sendResponse(res, 201, true, 'Post created successfully', post);
  })
);

// Get all posts
router.get(
  '/',
  validateRequest(schemas.pagination),
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await PostService.getPosts(page, limit);

    sendResponse(res, 200, true, 'Posts retrieved successfully', result);
  })
);

// Get post by ID
router.get(
  '/:postId',
  asyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.getPostById(req.params.postId);

    sendResponse(res, 200, true, 'Post retrieved successfully', post);
  })
);

// Get post comments
router.get(
  '/:postId/comments',
  asyncHandler(async (req: Request, res: Response) => {
    const comments = await PostService.getPostComments(req.params.postId);

    sendResponse(res, 200, true, 'Comments retrieved successfully', comments);
  })
);

// Like post
router.post(
  '/:postId/like',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await PostService.likePost(req.params.postId, req.user!.id);

    sendResponse(res, 200, true, 'Post liked successfully');
  })
);

// Unlike post
router.delete(
  '/:postId/like',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await PostService.unlikePost(req.params.postId, req.user!.id);

    sendResponse(res, 200, true, 'Post unliked successfully');
  })
);

// Create comment
router.post(
  '/:postId/comments',
  authenticate,
  validateRequest(schemas.createComment),
  asyncHandler(async (req: Request, res: Response) => {
    const comment = await PostService.createComment(req.params.postId, req.user!.id, req.body);

    sendResponse(res, 201, true, 'Comment created successfully', comment);
  })
);

// Delete comment
router.delete(
  '/:postId/comments/:commentId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await PostService.deleteComment(req.params.commentId, req.user!.id);

    sendResponse(res, 200, true, 'Comment deleted successfully');
  })
);

export default router;

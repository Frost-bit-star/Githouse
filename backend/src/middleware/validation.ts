import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errors.js';

/**
 * Validates only the keys defined in the schema.
 * Works with Joi v17+ and avoids crashes for missing paths.
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const toValidate: Record<string, any> = {};

      // Only validate keys present in the schema
      const schemaKeys = schema.describe().keys || {};
      if (schemaKeys.body) toValidate.body = req.body;
      if (schemaKeys.params) toValidate.params = req.params;
      if (schemaKeys.query) toValidate.query = req.query;

      const { error, value } = schema.validate(toValidate, { abortEarly: false });

      if (error) {
        const messages = error.details.map((detail) => detail.message).join(', ');
        throw new AppError(400, messages);
      }

      if (value.body) req.body = value.body;
      if (value.params) req.params = value.params;
      if (value.query) req.query = value.query;

      next();
    } catch (err) {
      next(err);
    }
  };
};

// --- Validation Schemas ---
export const schemas = {
  // Auth schemas
  register: Joi.object({
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      fullName: Joi.string().optional(),
    }),
  }),

  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  // User schemas
  updateProfile: Joi.object({
    body: Joi.object({
      fullName: Joi.string().optional(),
      bio: Joi.string().max(500).optional(),
      location: Joi.string().optional(),
      websiteUrl: Joi.string().uri().optional(),
      githubUrl: Joi.string().uri().optional(),
      twitterUrl: Joi.string().uri().optional(),
      avatarUrl: Joi.string().uri().optional(),
    }),
  }),

  // Community schemas
  createCommunity: Joi.object({
    body: Joi.object({
      name: Joi.string().required().max(255),
      description: Joi.string().max(1000).optional(),
      isPrivate: Joi.boolean().optional(),
    }),
  }),

  updateCommunity: Joi.object({
    body: Joi.object({
      name: Joi.string().max(255).optional(),
      description: Joi.string().max(1000).optional(),
      imageUrl: Joi.string().uri().optional(),
      coverUrl: Joi.string().uri().optional(),
      isPrivate: Joi.boolean().optional(),
    }),
  }),

  // Project schemas
  createProject: Joi.object({
    body: Joi.object({
      name: Joi.string().required().max(255),
      description: Joi.string().max(500).optional(),
      longDescription: Joi.string().optional(),
      communityId: Joi.string().uuid().optional(),
      repositoryUrl: Joi.string().uri().optional(),
      documentationUrl: Joi.string().uri().optional(),
    }),
  }),

  updateProject: Joi.object({
    body: Joi.object({
      name: Joi.string().max(255).optional(),
      description: Joi.string().max(500).optional(),
      longDescription: Joi.string().optional(),
      imageUrl: Joi.string().uri().optional(),
      repositoryUrl: Joi.string().uri().optional(),
      documentationUrl: Joi.string().uri().optional(),
      status: Joi.string().valid('active', 'archived', 'inactive').optional(),
    }),
  }),

  // Post schemas
  createPost: Joi.object({
    body: Joi.object({
      title: Joi.string().max(500).optional(),
      content: Joi.string().required(),
      communityId: Joi.string().uuid().optional(),
      projectId: Joi.string().uuid().optional(),
    }),
  }),

  // Comment schemas
  createComment: Joi.object({
    body: Joi.object({
      content: Joi.string().required(),
    }),
  }),

  // Moderation schemas
  createModerationReport: Joi.object({
    body: Joi.object({
      reportedUserId: Joi.string().uuid().optional(),
      reportedPostId: Joi.string().uuid().optional(),
      reportedCommentId: Joi.string().uuid().optional(),
      reason: Joi.string().required().max(255),
      description: Joi.string().max(2000).optional(),
    }).min(1),
  }),

  updateModerationReport: Joi.object({
    body: Joi.object({
      status: Joi.string().valid('pending', 'reviewing', 'resolved', 'dismissed').optional(),
      adminNotes: Joi.string().max(2000).optional(),
    }),
  }),

  // Pagination
  pagination: Joi.object({
    query: Joi.object({
      page: Joi.number().min(1).optional(),
      limit: Joi.number().min(1).max(100).optional(),
      sort: Joi.string().optional(),
      order: Joi.string().valid('ASC', 'DESC').optional(),
    }),
  }),
};

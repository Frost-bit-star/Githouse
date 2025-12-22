import { query } from '../database/connection.js';
import { Post, Comment, CreatePostDto, CreateCommentDto, PaginatedResponse } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { getPaginationOffset, calculateTotalPages } from '../utils/validation.js';
import { config } from '../config/config.js';

export const PostService = {
  // Create post
  async createPost(userId: string, dto: CreatePostDto): Promise<Post> {
    const result = await query(
      `INSERT INTO posts (author_id, title, content, community_id, project_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, author_id, community_id, project_id, title, content, image_url, like_count, comment_count, share_count, created_at, updated_at`,
      [userId, dto.title || null, dto.content, dto.communityId || null, dto.projectId || null]
    );

    return this.mapRowToPost(result.rows[0]);
  },

  // Get post by ID
  async getPostById(postId: string): Promise<Post> {
    const result = await query(
      `SELECT id, author_id, community_id, project_id, title, content, image_url, like_count, comment_count, share_count, created_at, updated_at
       FROM posts WHERE id = $1`,
      [postId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Post not found');
    }

    return this.mapRowToPost(result.rows[0]);
  },

  // Get posts with pagination
  async getPosts(
    page: number = 1,
    limit: number = config.pagination.defaultPageSize
  ): Promise<PaginatedResponse<Post>> {
    const validLimit = Math.min(limit, config.pagination.maxPageSize);
    const offset = getPaginationOffset(page, validLimit);

    const [result, countResult] = await Promise.all([
      query(
        `SELECT id, author_id, community_id, project_id, title, content, image_url, like_count, comment_count, share_count, created_at, updated_at
         FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [validLimit, offset]
      ),
      query('SELECT COUNT(*) as count FROM posts'),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: result.rows.map((row: any) => this.mapRowToPost(row)),
      pagination: {
        page,
        limit: validLimit,
        total,
        pages: calculateTotalPages(total, validLimit),
      },
    };
  },

  // Get user posts
  async getUserPosts(userId: string): Promise<Post[]> {
    const result = await query(
      `SELECT id, author_id, community_id, project_id, title, content, image_url, like_count, comment_count, share_count, created_at, updated_at
       FROM posts WHERE author_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row: any) => this.mapRowToPost(row));
  },

  // Get community posts
  async getCommunityPosts(communityId: string): Promise<Post[]> {
    const result = await query(
      `SELECT id, author_id, community_id, project_id, title, content, image_url, like_count, comment_count, share_count, created_at, updated_at
       FROM posts WHERE community_id = $1 ORDER BY created_at DESC`,
      [communityId]
    );

    return result.rows.map((row: any) => this.mapRowToPost(row));
  },

  // Like a post
  async likePost(postId: string, userId: string): Promise<void> {
    const result = await query(
      `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING id`,
      [postId, userId]
    );

    if (result.rows.length > 0) {
      await query('UPDATE posts SET like_count = like_count + 1 WHERE id = $1', [postId]);
    }
  },

  // Unlike a post
  async unlikePost(postId: string, userId: string): Promise<void> {
    const result = await query(
      'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2 RETURNING id',
      [postId, userId]
    );

    if (result.rows.length > 0) {
      await query('UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1', [postId]);
    }
  },

  // Create comment
  async createComment(postId: string, userId: string, dto: CreateCommentDto): Promise<Comment> {
    // Verify post exists
    const postCheck = await query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0) {
      throw new AppError(404, 'Post not found');
    }

    const result = await query(
      `INSERT INTO comments (post_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, post_id, author_id, content, like_count, created_at, updated_at`,
      [postId, userId, dto.content]
    );

    // Update post comment count
    await query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1', [postId]);

    return this.mapRowToComment(result.rows[0]);
  },

  // Get post comments
  async getPostComments(postId: string): Promise<Comment[]> {
    const result = await query(
      `SELECT id, post_id, author_id, content, like_count, created_at, updated_at
       FROM comments WHERE post_id = $1 ORDER BY created_at ASC`,
      [postId]
    );

    return result.rows.map((row: any) => this.mapRowToComment(row));
  },

  // Delete comment
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const result = await query(
      'SELECT post_id FROM comments WHERE id = $1 AND author_id = $2',
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Comment not found or unauthorized');
    }

    const postId = result.rows[0].post_id;
    await query('DELETE FROM comments WHERE id = $1', [commentId]);
    await query('UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = $1', [
      postId,
    ]);
  },

  // Helper functions
  mapRowToPost(row: any): Post {
    return {
      id: row.id,
      authorId: row.author_id,
      communityId: row.community_id,
      projectId: row.project_id,
      title: row.title,
      content: row.content,
      imageUrl: row.image_url,
      likeCount: row.like_count,
      commentCount: row.comment_count,
      shareCount: row.share_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  mapRowToComment(row: any): Comment {
    return {
      id: row.id,
      postId: row.post_id,
      authorId: row.author_id,
      content: row.content,
      likeCount: row.like_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

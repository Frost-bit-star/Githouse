import { query } from '../database/connection.js';
import { Community, CreateCommunityDto, UpdateCommunityDto, PaginatedResponse } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { slugify, getPaginationOffset, calculateTotalPages } from '../utils/validation.js';
import { config } from '../config/config.js';

export const CommunityService = {
  // Create community
  async createCommunity(userId: string, dto: CreateCommunityDto): Promise<Community> {
    const slug = slugify(dto.name);

    // Check if slug already exists
    const existing = await query('SELECT id FROM communities WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      throw new AppError(409, 'Community with this name already exists');
    }

    const result = await query(
      `INSERT INTO communities (name, slug, description, owner_id, is_private)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, slug, description, image_url, cover_url, owner_id, is_private, member_count, created_at, updated_at`,
      [dto.name, slug, dto.description || null, userId, dto.isPrivate || false]
    );

    // Add creator as owner member
    await query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3)',
      [result.rows[0].id, userId, 'owner']
    );

    return this.mapRowToCommunity(result.rows[0]);
  },

  // Get community by slug
  async getCommunityBySlug(slug: string): Promise<Community> {
    const result = await query(
      `SELECT id, name, slug, description, image_url, cover_url, owner_id, is_private, member_count, created_at, updated_at
       FROM communities WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Community not found');
    }

    return this.mapRowToCommunity(result.rows[0]);
  },

  // Get community by ID
  async getCommunityById(communityId: string): Promise<Community> {
    const result = await query(
      `SELECT id, name, slug, description, image_url, cover_url, owner_id, is_private, member_count, created_at, updated_at
       FROM communities WHERE id = $1`,
      [communityId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Community not found');
    }

    return this.mapRowToCommunity(result.rows[0]);
  },

  // Get all communities with pagination
  async getCommunities(
    page: number = 1,
    limit: number = config.pagination.defaultPageSize
  ): Promise<PaginatedResponse<Community>> {
    const validLimit = Math.min(limit, config.pagination.maxPageSize);
    const offset = getPaginationOffset(page, validLimit);

    const [result, countResult] = await Promise.all([
      query(
        `SELECT id, name, slug, description, image_url, cover_url, owner_id, is_private, member_count, created_at, updated_at
         FROM communities ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [validLimit, offset]
      ),
      query('SELECT COUNT(*) as count FROM communities'),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: result.rows.map((row) => this.mapRowToCommunity(row)),
      pagination: {
        page,
        limit: validLimit,
        total,
        pages: calculateTotalPages(total, validLimit),
      },
    };
  },

  // Get user's communities
  async getUserCommunities(userId: string): Promise<Community[]> {
    const result = await query(
      `SELECT c.id, c.name, c.slug, c.description, c.image_url, c.cover_url, c.owner_id, c.is_private, c.member_count, c.created_at, c.updated_at
       FROM communities c
       INNER JOIN community_members cm ON c.id = cm.community_id
       WHERE cm.user_id = $1 ORDER BY c.created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => this.mapRowToCommunity(row));
  },

  // Update community
  async updateCommunity(communityId: string, userId: string, dto: UpdateCommunityDto): Promise<Community> {
    // Check if user is owner
    const ownerCheck = await query(
      'SELECT owner_id FROM communities WHERE id = $1',
      [communityId]
    );

    if (ownerCheck.rows.length === 0) {
      throw new AppError(404, 'Community not found');
    }

    if (ownerCheck.rows[0].owner_id !== userId) {
      throw new AppError(403, 'Forbidden');
    }

    const updateFields: string[] = [];
    const values: any[] = [communityId];
    let paramIndex = 2;

    if (dto.name) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(dto.name);
      paramIndex++;
    }

    if (dto.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(dto.description || null);
      paramIndex++;
    }

    if (dto.imageUrl) {
      updateFields.push(`image_url = $${paramIndex}`);
      values.push(dto.imageUrl);
      paramIndex++;
    }

    if (dto.coverUrl) {
      updateFields.push(`cover_url = $${paramIndex}`);
      values.push(dto.coverUrl);
      paramIndex++;
    }

    if (dto.isPrivate !== undefined) {
      updateFields.push(`is_private = $${paramIndex}`);
      values.push(dto.isPrivate);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return this.getCommunityById(communityId);
    }

    const result = await query(
      `UPDATE communities SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, name, slug, description, image_url, cover_url, owner_id, is_private, member_count, created_at, updated_at`,
      values
    );

    return this.mapRowToCommunity(result.rows[0]);
  },

  // Get community members
  async getCommunityMembers(communityId: string): Promise<any[]> {
    const result = await query(
      `SELECT u.id, u.username, u.full_name, u.avatar_url, u.role, cm.role as member_role, cm.joined_at
       FROM users u
       INNER JOIN community_members cm ON u.id = cm.user_id
       WHERE cm.community_id = $1
       ORDER BY cm.joined_at DESC`,
      [communityId]
    );

    return result.rows;
  },

  // Add member to community
  async addMember(communityId: string, userId: string, role: string = 'member'): Promise<void> {
    await query(
      `INSERT INTO community_members (community_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (community_id, user_id) DO NOTHING`,
      [communityId, userId, role]
    );

    // Update member count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM community_members WHERE community_id = $1',
      [communityId]
    );

    await query(
      'UPDATE communities SET member_count = $1 WHERE id = $2',
      [countResult.rows[0].count, communityId]
    );
  },

  // Helper function
  mapRowToCommunity(row: any): Community {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: row.image_url,
      coverUrl: row.cover_url,
      ownerId: row.owner_id,
      isPrivate: row.is_private,
      memberCount: row.member_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

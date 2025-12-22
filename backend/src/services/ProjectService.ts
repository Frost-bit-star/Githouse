import { query } from '../database/connection.js';
import { Project, CreateProjectDto, UpdateProjectDto, PaginatedResponse } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { slugify, getPaginationOffset, calculateTotalPages } from '../utils/validation.js';
import { config } from '../config/config.js';

export const ProjectService = {
  // Create project
  async createProject(userId: string, dto: CreateProjectDto): Promise<Project> {
    const slug = slugify(dto.name);

    // Check if slug already exists
    const existing = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      throw new AppError(409, 'Project with this name already exists');
    }

    const result = await query(
      `INSERT INTO projects (name, slug, description, long_description, owner_id, community_id, repository_url, documentation_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url, 
                 documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at`,
      [
        dto.name,
        slug,
        dto.description || null,
        dto.longDescription || null,
        userId,
        dto.communityId || null,
        dto.repositoryUrl || null,
        dto.documentationUrl || null,
      ]
    );

    // Add creator as contributor
    await query(
      'INSERT INTO project_contributors (project_id, user_id, role) VALUES ($1, $2, $3)',
      [result.rows[0].id, userId, 'owner']
    );

    return this.mapRowToProject(result.rows[0]);
  },

  // Get project by slug
  async getProjectBySlug(slug: string): Promise<Project> {
    const result = await query(
      `SELECT id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url, 
              documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at
       FROM projects WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Project not found');
    }

    return this.mapRowToProject(result.rows[0]);
  },

  // Get project by ID
  async getProjectById(projectId: string): Promise<Project> {
    const result = await query(
      `SELECT id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url,
              documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at
       FROM projects WHERE id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Project not found');
    }

    return this.mapRowToProject(result.rows[0]);
  },

  // Get all projects with pagination
  async getProjects(
    page: number = 1,
    limit: number = config.pagination.defaultPageSize
  ): Promise<PaginatedResponse<Project>> {
    const validLimit = Math.min(limit, config.pagination.maxPageSize);
    const offset = getPaginationOffset(page, validLimit);

    const [result, countResult] = await Promise.all([
      query(
        `SELECT id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url,
                documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at
         FROM projects WHERE status = 'active' ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [validLimit, offset]
      ),
      query('SELECT COUNT(*) as count FROM projects WHERE status = $1', ['active']),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: result.rows.map((row: any) => this.mapRowToProject(row)),
      pagination: {
        page,
        limit: validLimit,
        total,
        pages: calculateTotalPages(total, validLimit),
      },
    };
  },

  // Get community projects
  async getCommunityProjects(communityId: string): Promise<Project[]> {
    const result = await query(
      `SELECT id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url,
              documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at
       FROM projects WHERE community_id = $1 AND status = 'active' ORDER BY created_at DESC`,
      [communityId]
    );

    return result.rows.map((row: any) => this.mapRowToProject(row));
  },

  // Get user's projects
  async getUserProjects(userId: string): Promise<Project[]> {
    const result = await query(
      `SELECT id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url,
              documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at
       FROM projects WHERE owner_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row: any) => this.mapRowToProject(row));
  },

  // Update project
  async updateProject(projectId: string, userId: string, dto: UpdateProjectDto): Promise<Project> {
    // Check if user is owner
    const ownerCheck = await query(
      'SELECT owner_id FROM projects WHERE id = $1',
      [projectId]
    );

    if (ownerCheck.rows.length === 0) {
      throw new AppError(404, 'Project not found');
    }

    if (ownerCheck.rows[0].owner_id !== userId) {
      throw new AppError(403, 'Forbidden');
    }

    const updateFields: string[] = [];
    const values: any[] = [projectId];
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

    if (dto.longDescription !== undefined) {
      updateFields.push(`long_description = $${paramIndex}`);
      values.push(dto.longDescription || null);
      paramIndex++;
    }

    if (dto.imageUrl) {
      updateFields.push(`image_url = $${paramIndex}`);
      values.push(dto.imageUrl);
      paramIndex++;
    }

    if (dto.repositoryUrl) {
      updateFields.push(`repository_url = $${paramIndex}`);
      values.push(dto.repositoryUrl);
      paramIndex++;
    }

    if (dto.documentationUrl) {
      updateFields.push(`documentation_url = $${paramIndex}`);
      values.push(dto.documentationUrl);
      paramIndex++;
    }

    if (dto.status) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(dto.status);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return this.getProjectById(projectId);
    }

    const result = await query(
      `UPDATE projects SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, name, slug, description, long_description, image_url, owner_id, community_id, repository_url,
                 documentation_url, star_count, fork_count, contributor_count, status, created_at, updated_at`,
      values
    );

    return this.mapRowToProject(result.rows[0]);
  },

  // Helper function
  mapRowToProject(row: any): Project {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      longDescription: row.long_description,
      imageUrl: row.image_url,
      ownerId: row.owner_id,
      communityId: row.community_id,
      repositoryUrl: row.repository_url,
      documentationUrl: row.documentation_url,
      starCount: row.star_count,
      forkCount: row.fork_count,
      contributorCount: row.contributor_count,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

import { query } from '../database/connection.js';
import { ModerationReport, CreateModerationReportDto, UpdateModerationReportDto } from '../types/index.js';
import { AppError } from '../utils/errors.js';

export const ModerationService = {
  // Create moderation report
  async createReport(userId: string, dto: CreateModerationReportDto): Promise<ModerationReport> {
    // Validate that at least one item is being reported
    if (!dto.reportedUserId && !dto.reportedPostId && !dto.reportedCommentId) {
      throw new AppError(400, 'Must report either a user, post, or comment');
    }

    const result = await query(
      `INSERT INTO moderation_reports (reporter_id, reported_user_id, reported_post_id, reported_comment_id, reason, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, reporter_id, reported_user_id, reported_post_id, reported_comment_id, reason, description, status, admin_notes, created_at, updated_at, resolved_at`,
      [
        userId,
        dto.reportedUserId || null,
        dto.reportedPostId || null,
        dto.reportedCommentId || null,
        dto.reason,
        dto.description || null,
      ]
    );

    return this.mapRowToReport(result.rows[0]);
  },

  // Get report by ID
  async getReportById(reportId: string): Promise<ModerationReport> {
    const result = await query(
      `SELECT id, reporter_id, reported_user_id, reported_post_id, reported_comment_id, reason, description, status, admin_notes, created_at, updated_at, resolved_at
       FROM moderation_reports WHERE id = $1`,
      [reportId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Report not found');
    }

    return this.mapRowToReport(result.rows[0]);
  },

  // Get all reports (admin only)
  async getAllReports(
    status?: string,
    limit: number = 50
  ): Promise<ModerationReport[]> {
    let query_text = `SELECT id, reporter_id, reported_user_id, reported_post_id, reported_comment_id, reason, description, status, admin_notes, created_at, updated_at, resolved_at
                      FROM moderation_reports`;
    const params: any[] = [];

    if (status) {
      query_text += ` WHERE status = $1`;
      params.push(status);
    }

    query_text += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(query_text, params);
    return result.rows.map((row: any) => this.mapRowToReport(row));
  },

  // Update report status (admin only)
  async updateReport(
    reportId: string,
    dto: UpdateModerationReportDto
  ): Promise<ModerationReport> {
    const updateFields: string[] = [];
    const values: any[] = [reportId];
    let paramIndex = 2;

    if (dto.status) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(dto.status);
      paramIndex++;
    }

    if (dto.adminNotes) {
      updateFields.push(`admin_notes = $${paramIndex}`);
      values.push(dto.adminNotes);
      paramIndex++;
    }

    if (dto.status === 'resolved') {
      updateFields.push(`resolved_at = CURRENT_TIMESTAMP`);
    }

    if (updateFields.length === 0) {
      return this.getReportById(reportId);
    }

    const result = await query(
      `UPDATE moderation_reports SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, reporter_id, reported_user_id, reported_post_id, reported_comment_id, reason, description, status, admin_notes, created_at, updated_at, resolved_at`,
      values
    );

    return this.mapRowToReport(result.rows[0]);
  },

  // Suspend user (admin action)
  async suspendUser(userId: string, reason: string): Promise<void> {
    await query(
      'UPDATE users SET is_suspended = TRUE, suspension_reason = $1 WHERE id = $2',
      [reason, userId]
    );
  },

  // Unsuspend user
  async unsuspendUser(userId: string): Promise<void> {
    await query(
      'UPDATE users SET is_suspended = FALSE, suspension_reason = NULL WHERE id = $1',
      [userId]
    );
  },

  // Delete post (admin action)
  async deletePost(postId: string): Promise<void> {
    await query('DELETE FROM posts WHERE id = $1', [postId]);
  },

  // Delete comment (admin action)
  async deleteComment(commentId: string): Promise<void> {
    const result = await query('SELECT post_id FROM comments WHERE id = $1', [commentId]);
    if (result.rows.length > 0) {
      await query('UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = $1', [
        result.rows[0].post_id,
      ]);
    }
    await query('DELETE FROM comments WHERE id = $1', [commentId]);
  },

  // Helper function
  mapRowToReport(row: any): ModerationReport {
    return {
      id: row.id,
      reporterId: row.reporter_id,
      reportedUserId: row.reported_user_id,
      reportedPostId: row.reported_post_id,
      reportedCommentId: row.reported_comment_id,
      reason: row.reason,
      description: row.description,
      status: row.status,
      adminNotes: row.admin_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resolvedAt: row.resolved_at,
    };
  },
};

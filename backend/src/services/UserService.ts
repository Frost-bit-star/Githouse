import { query } from '../database/connection.js';
import { User, UserWithPassword, RegistrationDto, LoginDto } from '../types/index.js';
import { hashPassword, comparePasswords } from '../utils/auth.js';
import { AppError } from '../utils/errors.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation.js';

export const UserService = {
  // Register a new user
  async register(dto: RegistrationDto): Promise<User> {
    // Validate input
    if (!validateEmail(dto.email)) {
      throw new AppError(400, 'Invalid email format');
    }

    const passwordValidation = validatePassword(dto.password);
    if (!passwordValidation.valid) {
      throw new AppError(400, passwordValidation.errors.join(', '));
    }

    if (!validateUsername(dto.username)) {
      throw new AppError(400, 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens');
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1 OR username = $2', [
      dto.email,
      dto.username,
    ]);

    if (existingUser.rows.length > 0) {
      throw new AppError(409, 'User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password, username, full_name, is_verified, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, username, full_name, role, is_verified, is_active, created_at, updated_at`,
      [dto.email, hashedPassword, dto.username, dto.fullName || null, false, true]
    );

    return this.mapRowToUser(result.rows[0]);
  },

  // Login user
  async login(dto: LoginDto): Promise<User> {
    const result = await query(
      `SELECT id, email, password, username, full_name, role, is_verified, is_active, is_suspended, created_at, updated_at
       FROM users WHERE email = $1`,
      [dto.email]
    );

    if (result.rows.length === 0) {
      throw new AppError(401, 'Invalid email or password');
    }

    const user = result.rows[0] as any;

    // Check if user is suspended
    if (user.is_suspended) {
      throw new AppError(403, 'Account is suspended');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError(403, 'Account is disabled');
    }

    // Verify password
    const isPasswordValid = await comparePasswords(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    return this.mapRowToUser(user);
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    const result = await query(
      `SELECT id, email, username, full_name, avatar_url, bio, location, website_url, github_url, twitter_url,
              role, is_verified, is_active, is_suspended, last_activity_at, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    return this.mapRowToUser(result.rows[0]);
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    const result = await query(
      `SELECT id, email, username, full_name, avatar_url, bio, location, website_url, github_url, twitter_url,
              role, is_verified, is_active, is_suspended, last_activity_at, created_at, updated_at
       FROM users WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    return this.mapRowToUser(result.rows[0]);
  },

  // Get user stats (followers, following, etc.)
  async getUserStats(userId: string): Promise<{
    followers: number;
    following: number;
    communities: number;
    projects: number;
  }> {
    const [followersResult, followingResult, communitiesResult, projectsResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM user_follows WHERE following_id = $1', [userId]),
      query('SELECT COUNT(*) as count FROM user_follows WHERE follower_id = $1', [userId]),
      query('SELECT COUNT(*) as count FROM community_members WHERE user_id = $1', [userId]),
      query('SELECT COUNT(*) as count FROM projects WHERE owner_id = $1', [userId]),
    ]);

    return {
      followers: parseInt(followersResult.rows[0].count, 10),
      following: parseInt(followingResult.rows[0].count, 10),
      communities: parseInt(communitiesResult.rows[0].count, 10),
      projects: parseInt(projectsResult.rows[0].count, 10),
    };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const allowed = ['fullName', 'bio', 'location', 'websiteUrl', 'githubUrl', 'twitterUrl', 'avatarUrl'];
    const updateFields: string[] = [];
    const values: any[] = [userId];
    let paramIndex = 2;

    for (const [key, value] of Object.entries(updates)) {
      if (allowed.includes(key)) {
        const dbKey = key
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '');
        updateFields.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return this.getUserById(userId);
    }

    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id, email, username, full_name, avatar_url, bio, location, website_url, github_url, twitter_url,
                 role, is_verified, is_active, is_suspended, last_activity_at, created_at, updated_at`,
      values
    );

    return this.mapRowToUser(result.rows[0]);
  },

  // Helper function to map database row to User object
  mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      location: row.location,
      websiteUrl: row.website_url,
      githubUrl: row.github_url,
      twitterUrl: row.twitter_url,
      role: row.role,
      isVerified: row.is_verified,
      isActive: row.is_active,
      isSuspended: row.is_suspended,
      lastActivityAt: row.last_activity_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

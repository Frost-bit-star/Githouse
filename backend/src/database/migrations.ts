import { query, getClient } from './connection.js';

export const runMigrations = async (): Promise<void> => {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        avatar_url TEXT,
        bio TEXT,
        location VARCHAR(255),
        website_url VARCHAR(255),
        github_url VARCHAR(255),
        twitter_url VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        is_suspended BOOLEAN DEFAULT FALSE,
        suspension_reason TEXT,
        last_activity_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `);

    // Communities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS communities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        cover_url TEXT,
        owner_id UUID NOT NULL,
        is_private BOOLEAN DEFAULT FALSE,
        member_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
      CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON communities(owner_id);
      CREATE INDEX IF NOT EXISTS idx_communities_created_at ON communities(created_at);
    `);

    // Community Members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        community_id UUID NOT NULL,
        user_id UUID NOT NULL,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'owner')),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(community_id, user_id),
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
      CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
    `);

    // Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        long_description TEXT,
        image_url TEXT,
        owner_id UUID NOT NULL,
        community_id UUID,
        repository_url VARCHAR(500),
        documentation_url VARCHAR(500),
        star_count INT DEFAULT 0,
        fork_count INT DEFAULT 0,
        contributor_count INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
      CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
      CREATE INDEX IF NOT EXISTS idx_projects_community_id ON projects(community_id);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
    `);

    // Project Contributors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_contributors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL,
        user_id UUID NOT NULL,
        role VARCHAR(50) DEFAULT 'contributor',
        contribution_count INT DEFAULT 0,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_project_contributors_project_id ON project_contributors(project_id);
      CREATE INDEX IF NOT EXISTS idx_project_contributors_user_id ON project_contributors(user_id);
    `);

    // User Follows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID NOT NULL,
        following_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
        CHECK (follower_id != following_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
      CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
    `);

    // Posts/Activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL,
        community_id UUID,
        project_id UUID,
        title VARCHAR(500),
        content TEXT NOT NULL,
        image_url TEXT,
        like_count INT DEFAULT 0,
        comment_count INT DEFAULT 0,
        share_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
      CREATE INDEX IF NOT EXISTS idx_posts_project_id ON posts(project_id);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
    `);

    // Post Likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL,
        user_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
    `);

    // Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL,
        author_id UUID NOT NULL,
        content TEXT NOT NULL,
        like_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
      CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
    `);

    // Moderation Reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS moderation_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id UUID NOT NULL,
        reported_user_id UUID,
        reported_post_id UUID,
        reported_comment_id UUID,
        reason VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (reported_post_id) REFERENCES posts(id) ON DELETE SET NULL,
        FOREIGN KEY (reported_comment_id) REFERENCES comments(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_moderation_reports_status ON moderation_reports(status);
      CREATE INDEX IF NOT EXISTS idx_moderation_reports_reporter_id ON moderation_reports(reporter_id);
      CREATE INDEX IF NOT EXISTS idx_moderation_reports_created_at ON moderation_reports(created_at);
    `);

    // Email Verification Tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
    `);

    // Password Reset Tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
    `);

    // Activity Log table for analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        details JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

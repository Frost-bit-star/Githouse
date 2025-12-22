export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  role: 'user' | 'moderator' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  coverUrl?: string;
  ownerId: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: 'member' | 'moderator' | 'owner';
  joinedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  ownerId: string;
  communityId?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  starCount: number;
  forkCount: number;
  contributorCount: number;
  status: 'active' | 'archived' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectContributor {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  contributionCount: number;
  joinedAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  communityId?: string;
  projectId?: string;
  title?: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RegistrationDto {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateCommunityDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateCommunityDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  coverUrl?: string;
  isPrivate?: boolean;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  longDescription?: string;
  communityId?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  longDescription?: string;
  imageUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  status?: 'active' | 'archived' | 'inactive';
}

export interface CreatePostDto {
  title?: string;
  content: string;
  communityId?: string;
  projectId?: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface CreateModerationReportDto {
  reportedUserId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
  reason: string;
  description?: string;
}

export interface UpdateModerationReportDto {
  status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  adminNotes?: string;
}

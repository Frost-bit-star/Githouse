# Githouse - Backend & Frontend Integration Setup

This is a production-grade backend for the Githouse developer social platform, fully integrated with the React frontend.

## Architecture Overview

### Backend Stack
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: bcryptjs, helmet, CORS, rate limiting
- **ORM**: Raw SQL with pg library (connection pooling)

### Frontend Integration
- **State Management**: React Context (AuthContext, DataContext)
- **API Client**: Custom fetch-based client with token management
- **Components**: Fully integrated with real backend data

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.ts              # Configuration management
│   ├── database/
│   │   ├── connection.ts          # Database connection pool
│   │   ├── migrations.ts          # Schema migrations
│   │   └── seed.ts                # Database seeding
│   ├── middleware/
│   │   ├── auth.ts                # Authentication & authorization
│   │   └── validation.ts          # Request validation
│   ├── routes/
│   │   ├── authRoutes.ts          # Auth endpoints
│   │   ├── communityRoutes.ts     # Community endpoints
│   │   ├── projectRoutes.ts       # Project endpoints
│   │   ├── postRoutes.ts          # Post/feed endpoints
│   │   └── moderationRoutes.ts    # Moderation endpoints
│   ├── services/
│   │   ├── UserService.ts         # User business logic
│   │   ├── CommunityService.ts    # Community business logic
│   │   ├── ProjectService.ts      # Project business logic
│   │   ├── PostService.ts         # Post business logic
│   │   └── ModerationService.ts   # Moderation business logic
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── auth.ts                # Auth utilities (JWT, password hashing)
│   │   ├── validation.ts          # Validation utilities
│   │   └── errors.ts              # Error handling
│   └── index.ts                   # Express app entry point
├── .env                           # Environment variables
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # API client for backend communication
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── DataContext.tsx        # Application data state
│   ├── components/                # React components
│   └── ...
└── .env.local                     # Frontend env variables
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb githouse_dev
   ```

5. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed sample data (optional):**
   ```bash
   npm run db:seed
   ```

7. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # .env.local should already have:
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/user/:username` - Get user by username
- `PUT /api/auth/me` - Update profile

### Communities
- `POST /api/communities` - Create community
- `GET /api/communities` - Get all communities (paginated)
- `GET /api/communities/:slug` - Get community by slug
- `GET /api/communities/:slug/members` - Get community members
- `PUT /api/communities/:slug` - Update community (admin only)
- `POST /api/communities/:slug/join` - Join community

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects (paginated)
- `GET /api/projects/:slug` - Get project by slug
- `PUT /api/projects/:slug` - Update project (owner only)

### Posts & Feed
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:postId` - Get post by ID
- `POST /api/posts/:postId/like` - Like post
- `DELETE /api/posts/:postId/like` - Unlike post
- `POST /api/posts/:postId/comments` - Create comment
- `GET /api/posts/:postId/comments` - Get post comments
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment

### Moderation
- `POST /api/moderation/reports` - Create moderation report
- `GET /api/moderation/reports` - Get all reports (admin only)
- `PUT /api/moderation/reports/:reportId` - Update report (admin only)
- `POST /api/moderation/users/:userId/suspend` - Suspend user (admin only)
- `POST /api/moderation/users/:userId/unsuspend` - Unsuspend user (admin only)

## Database Schema

### Key Tables
- **users** - User accounts with authentication
- **communities** - Developer communities
- **community_members** - Community membership tracking
- **projects** - Development projects
- **project_contributors** - Project contributor tracking
- **posts** - Feed posts and discussions
- **comments** - Post comments
- **post_likes** - Like tracking
- **user_follows** - User following relationships
- **moderation_reports** - Moderation reports
- **activity_logs** - Activity audit trail

## Authentication Flow

1. **Registration/Login**: User provides credentials → Backend validates → JWT token issued
2. **Token Storage**: Frontend stores token in localStorage
3. **API Requests**: Frontend includes token in Authorization header (`Bearer <token>`)
4. **Token Validation**: Backend validates token on protected routes
5. **Token Refresh**: Refresh tokens can be used to get new access tokens

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=githouse_dev
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Development Commands

### Backend
```bash
npm run dev          # Start dev server with auto-reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Run compiled code
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed sample data
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Production Deployment

### Backend
1. Build the project: `npm run build`
2. Set production environment variables
3. Run migrations: `npm run db:migrate`
4. Start server: `npm run start`
5. Use a process manager like PM2

### Frontend
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API URL

## Features Implemented

### User Management
- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Profile management
- ✅ User statistics (followers, following, etc.)
- ✅ User follows system

### Communities
- ✅ Create and manage communities
- ✅ Community membership
- ✅ Member roles and permissions
- ✅ Community discovery

### Projects
- ✅ Project creation and management
- ✅ Project contributors
- ✅ Project linking to communities
- ✅ Project statistics

### Social Features
- ✅ Post creation and management
- ✅ Comment system
- ✅ Like/unlike posts
- ✅ Activity feed

### Moderation
- ✅ Report creation
- ✅ Report management (admin)
- ✅ User suspension
- ✅ Content moderation

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation with Joi

## Performance Optimizations

- Connection pooling for database
- Indexed database queries
- Pagination support
- Error handling and logging
- Efficient TypeScript compilation

## Error Handling

All API responses follow a consistent format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // Optional, only on success
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

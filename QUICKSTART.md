# Quick Start Guide - Githouse Full Stack

## Start Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed  # Optional: load sample data
npm run dev
```

Backend runs on: `http://localhost:5000`

## Start Frontend

```bash
# In another terminal
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Database Setup

Make sure PostgreSQL is running and create the database:

```bash
createdb githouse_dev
```

Update backend `.env` with your database credentials if different from defaults.

## API Client Usage in Frontend

The API client is available throughout the app via contexts:

```typescript
// In any component:
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  const { communities, projects, posts } = useData();
  
  // Use the data...
}
```

## Testing the Integration

1. Open frontend at `http://localhost:5173`
2. Components will automatically fetch data from backend
3. Check browser console for any errors
4. Backend logs will show all API requests

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Check .env file exists with correct database credentials
- Check port 5000 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env.local is correct
- Check browser console for CORS errors

### Database migration fails
- Ensure PostgreSQL is running
- Delete .env and reconfigure it
- Check database exists: `createdb githouse_dev`

## API Key Features

### Authentication
All endpoints (except auth) require JWT token in header:
```
Authorization: Bearer <token>
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Pagination
Use query parameters:
```
GET /api/communities?page=1&limit=20
```

## Next Steps

1. Customize the application with your branding
2. Add additional features as needed
3. Deploy to your hosting platform
4. Set up CI/CD pipeline

See `BACKEND_SETUP.md` for detailed documentation.

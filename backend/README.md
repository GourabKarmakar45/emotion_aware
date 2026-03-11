# Backend Server for Emotion-Aware Study Assistant

Simple Express.js backend with JWT authentication.

## Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/login
Login with existing credentials
```json
{
  "email": "emma@example.com",
  "password": "password123"
}
```

#### GET /api/user
Get current user profile (requires authentication token)
```
Headers: Authorization: Bearer <token>
```

#### GET /api/health
Health check endpoint

## Demo Credentials

```
Email: emma@example.com
Password: password123
```

## Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS enabled for frontend
- In-memory user storage (replace with database in production)

## Security Notes

⚠️ This is a demo backend. For production:
- Use a real database (MongoDB, PostgreSQL, etc.)
- Store JWT_SECRET in environment variables
- Add rate limiting
- Add input validation
- Use HTTPS
- Add refresh tokens
- Implement proper error handling

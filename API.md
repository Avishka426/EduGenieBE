# EduGenie Backend API

## Base URL
```
http://localhost:3000
```

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student",
    "profilePicture": null,
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Logout User (Protected)
```
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logout successful",
  "instructions": "Please remove the token from client storage"
}
```

## Utility Endpoints

### Health Check
```
GET /health
```

**Response (200):**
```json
{
  "message": "EduGenie Backend is running!",
  "timestamp": "2025-07-24T05:40:55.188Z",
  "environment": "development"
}
```

### API Info
```
GET /api
```

**Response (200):**
```json
{
  "message": "EduGenie API v1.0",
  "endpoints": {
    "auth": {
      "register": "POST /api/auth/register",
      "login": "POST /api/auth/login",
      "profile": "GET /api/auth/profile (requires auth)"
    }
  }
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "message": "Email, password, and name are required"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid credentials"
}
```

**409 Conflict:**
```json
{
  "message": "User with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Error registering user"
}
```

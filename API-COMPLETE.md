# EduGenie Backend API Documentation

## Overview
Complete backend API for the EduGenie online learning platform with course management and user authentication.

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "student" // or "instructor"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 📚 Course Management Endpoints

### 1. Get Course Categories (Public)
```http
GET /api/courses/categories
```

**Response:**
```json
{
  "categories": [
    {
      "id": "programming",
      "name": "Programming",
      "value": "Programming"
    },
    {
      "id": "web-development",
      "name": "Web Development", 
      "value": "Web Development"
    }
    // ... more categories
  ]
}
```

**Available Categories:**
- Programming
- Web Development
- Mobile Development
- Data Science
- Machine Learning
- Cybersecurity
- Cloud Computing
- Database
- DevOps
- UI/UX Design
- Business
- Marketing
- Other

### 2. Browse Courses (Public)
```http
GET /api/courses
```

**Query Parameters:**
- `category` - Filter by category
- `level` - Filter by level (Beginner, Intermediate, Advanced)
- `search` - Text search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (createdAt, price, title)
- `sortOrder` - Sort order (asc, desc)

**Example:**
```http
GET /api/courses?category=Programming&level=Beginner&page=1&limit=10
```

**Response:**
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript basics",
      "instructorName": "John Instructor",
      "category": "Programming",
      "duration": 20,
      "level": "Beginner",
      "price": 49.99,
      "thumbnail": "thumbnail_url",
      "tags": ["javascript", "programming"],
      "enrollmentCount": 25,
      "maxStudents": 100,
      "status": "Published",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Get Course Details (Public)
```http
GET /api/courses/:id
```

**Response:**
```json
{
  "course": {
    "id": "course_id",
    "title": "JavaScript Fundamentals",
    "description": "Complete course description",
    "instructor": {
      "name": "John Instructor",
      "email": "instructor@example.com"
    },
    "instructorName": "John Instructor",
    "content": "Full course content here...",
    "category": "Programming",
    "duration": 20,
    "level": "Beginner",
    "price": 49.99,
    "thumbnail": "thumbnail_url",
    "tags": ["javascript", "programming"],
    "enrolledStudents": [...],
    "enrollmentCount": 25,
    "maxStudents": 100,
    "status": "Published",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

---

## 👨‍🎓 Student Endpoints

### 4. Enroll in Course
```http
POST /api/courses/:id/enroll
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "courseId": "course_id",
    "courseTitle": "JavaScript Fundamentals",
    "enrolledAt": "2025-01-15T10:00:00Z"
  }
}
```

### 5. Get Enrolled Courses
```http
GET /api/courses/student/enrolled
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "enrolledCourses": [
    {
      "id": "course_id",
      "title": "JavaScript Fundamentals",
      "description": "Course description",
      "instructorName": "John Instructor",
      "category": "Programming",
      "duration": 20,
      "level": "Beginner",
      "thumbnail": "thumbnail_url",
      "enrolledAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## 👨‍🏫 Instructor Endpoints

### 6. Create Course
```http
POST /api/courses
Authorization: Bearer <instructor_token>
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript from basics to advanced",
  "content": "Module 1: Variables\nModule 2: Functions\n...",
  "category": "Programming",
  "duration": 20,
  "level": "Beginner",
  "price": 49.99,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "tags": ["javascript", "programming", "beginner"],
  "maxStudents": 100
}
```

**Required Fields:**
- `title` (string)
- `description` (string)
- `content` (string)
- `category` (string, must be from available categories)
- `duration` (number, hours)
- `level` (string: "Beginner", "Intermediate", "Advanced")
- `price` (number)

**Optional Fields:**
- `thumbnail` (string, URL)
- `tags` (array of strings)
- `maxStudents` (number, null for unlimited)

**Response:**
```json
{
  "message": "Course created successfully",
  "course": {
    "id": "course_id",
    "title": "JavaScript Fundamentals",
    "description": "Course description",
    "instructorName": "John Instructor",
    "category": "Programming",
    "duration": 20,
    "level": "Beginner",
    "price": 49.99,
    "status": "Draft",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### 7. Get Instructor's Courses
```http
GET /api/courses/instructor/my-courses
Authorization: Bearer <instructor_token>
```

**Response:**
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "JavaScript Fundamentals",
      "description": "Course description",
      "category": "Programming",
      "duration": 20,
      "level": "Beginner",
      "price": 49.99,
      "enrollmentCount": 25,
      "maxStudents": 100,
      "status": "Published",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### 8. Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <instructor_token>
```

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "content": "Updated content",
  "category": "Web Development",
  "duration": 25,
  "level": "Intermediate",
  "price": 59.99,
  "thumbnail": "new_thumbnail_url",
  "tags": ["updated", "tags"],
  "maxStudents": 150,
  "status": "Published"
}
```

**Response:**
```json
{
  "message": "Course updated successfully",
  "course": {
    "id": "course_id",
    "title": "Updated Course Title",
    "description": "Updated description",
    "category": "Web Development",
    "duration": 25,
    "level": "Intermediate",
    "price": 59.99,
    "status": "Published",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

### 9. Get Enrolled Students for Course (Instructor)
```http
GET /api/courses/:id/students
Authorization: Bearer <instructor_token>
```

**Response:**
```json
{
  "course": {
    "id": "course_id",
    "title": "JavaScript Fundamentals",
    "instructorName": "John Instructor",
    "totalEnrolled": 25,
    "maxStudents": 100
  },
  "enrolledStudents": [
    {
      "id": "student_id",
      "name": "Student Name",
      "email": "student@example.com",
      "enrolledAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### 10. Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <instructor_token>
```

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

**Note:** Courses with enrolled students cannot be deleted (will return 400 error).

---

## 📊 Data Models

### Course Status
- `Draft` - Course is being created (default)
- `Published` - Course is live and available for enrollment
- `Archived` - Course is no longer available

### Course Levels
- `Beginner`
- `Intermediate` 
- `Advanced`

### User Roles
- `student` - Can browse and enroll in courses
- `instructor` - Can create and manage courses
- `admin` - Full access to all features

---

## 🔒 Authentication

Most endpoints require authentication using JWT tokens:

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

---

## ❌ Error Responses

All endpoints return consistent error formats:

```json
{
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal server error

---

## 🧪 Testing

Use the provided test scripts to verify API functionality:

```bash
# Test all endpoints
node test-course-api.js

# Quick debug test
node debug-test.js
```

---

## 🚀 Frontend Integration

Your React Native frontend can now connect to these endpoints. Make sure to:

1. Set the correct base URL in your API configuration
2. Include JWT tokens in authenticated requests
3. Handle loading states and error responses appropriately
4. Implement proper form validation for course creation

The backend is fully ready to support your complete course management system!

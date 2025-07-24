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

## Course Management Endpoints

### Create Course (Instructor Only)
```
POST /api/courses
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Full Stack Web Development",
  "description": "Learn to build modern web applications with React and Node.js",
  "content": "Course content and curriculum details...",
  "category": "Web Development",
  "duration": 40,
  "level": "Intermediate",
  "price": 99.99,
  "thumbnail": "https://example.com/image.jpg",
  "tags": ["React", "Node.js", "JavaScript"],
  "maxStudents": 50
}
```

**Response (201):**
```json
{
  "message": "Course created successfully",
  "course": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Full Stack Web Development",
    "description": "Learn to build modern web applications...",
    "instructorName": "John Instructor",
    "category": "Web Development",
    "duration": 40,
    "level": "Intermediate",
    "price": 99.99,
    "status": "Draft",
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Get All Courses
```
GET /api/courses?category=Programming&level=Beginner&page=1&limit=10
```

**Response (200):**
```json
{
  "courses": [
    {
      "id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Full Stack Web Development",
      "description": "Learn to build modern web applications...",
      "instructorName": "John Instructor",
      "category": "Web Development",
      "duration": 40,
      "level": "Intermediate",
      "price": 99.99,
      "enrollmentCount": 25,
      "maxStudents": 50,
      "status": "Published",
      "createdAt": "2025-07-24T05:40:55.188Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 45,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Course by ID
```
GET /api/courses/{id}
```

**Response (200):**
```json
{
  "course": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Full Stack Web Development",
    "description": "Learn to build modern web applications...",
    "content": "Detailed course content...",
    "instructorName": "John Instructor",
    "category": "Web Development",
    "duration": 40,
    "level": "Intermediate",
    "price": 99.99,
    "enrollmentCount": 25,
    "maxStudents": 50,
    "status": "Published",
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Get Instructor's Courses (Protected)
```
GET /api/courses/instructor/my-courses
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "courses": [
    {
      "id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Full Stack Web Development",
      "description": "Learn to build modern web applications...",
      "category": "Web Development",
      "duration": 40,
      "level": "Intermediate",
      "price": 99.99,
      "enrollmentCount": 25,
      "maxStudents": 50,
      "status": "Published",
      "createdAt": "2025-07-24T05:40:55.188Z"
    }
  ]
}
```

### Update Course (Protected)
```
PUT /api/courses/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "price": 149.99,
  "status": "Published"
}
```

**Response (200):**
```json
{
  "message": "Course updated successfully",
  "course": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Updated Course Title",
    "price": 149.99,
    "status": "Published",
    "updatedAt": "2025-07-24T06:40:55.188Z"
  }
}
```

### Delete Course (Protected)
```
DELETE /api/courses/{id}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

### Enroll in Course (Student Only)
```
POST /api/courses/{id}/enroll
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "courseId": "60f1b2b3c4d5e6f7a8b9c0d1",
    "courseTitle": "Full Stack Web Development",
    "enrolledAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Get Enrolled Courses (Student Only)
```
GET /api/courses/student/enrolled
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "enrolledCourses": [
    {
      "id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Full Stack Web Development",
      "description": "Learn to build modern web applications...",
      "instructorName": "John Instructor",
      "category": "Web Development",
      "duration": 40,
      "level": "Intermediate",
      "enrolledAt": "2025-07-24T05:40:55.188Z"
    }
  ]
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

## Course Management Endpoints

### Create Course (Instructor Only)
```
POST /api/courses
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript fundamentals from scratch",
  "content": "Course content goes here...",
  "category": "Programming",
  "duration": 20,
  "level": "Beginner",
  "price": 99.99,
  "maxStudents": 50,
  "tags": ["javascript", "programming", "web development"]
}
```

**Response (201):**
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript fundamentals from scratch",
    "instructor": "60f1b2b3c4d5e6f7a8b9c0d1",
    "instructorName": "John Instructor",
    "category": "Programming",
    "duration": 20,
    "level": "Beginner",
    "price": 99.99,
    "enrolledStudents": [],
    "maxStudents": 50,
    "status": "Published",
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Get All Courses (Public)
```
GET /api/courses?category=Programming&level=Beginner&page=1&limit=10
```

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript fundamentals from scratch",
      "instructor": {
        "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
        "name": "John Instructor"
      },
      "category": "Programming",
      "level": "Beginner",
      "price": 99.99,
      "duration": 20,
      "enrolledStudents": ["student1", "student2"],
      "createdAt": "2025-07-24T05:40:55.188Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Course by ID (Public)
```
GET /api/courses/{courseId}
```

**Response (200):**
```json
{
  "course": {
    "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript fundamentals from scratch",
    "content": "Full course content here...",
    "instructor": {
      "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "name": "John Instructor",
      "email": "instructor@example.com"
    },
    "category": "Programming",
    "level": "Beginner",
    "price": 99.99,
    "duration": 20,
    "enrolledStudents": [
      {
        "_id": "student1",
        "name": "Student One",
        "email": "student1@example.com"
      }
    ],
    "maxStudents": 50,
    "createdAt": "2025-07-24T05:40:55.188Z"
  }
}
```

### Get Instructor's Courses (Instructor Only)
```
GET /api/courses/instructor/my-courses
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript fundamentals from scratch",
      "enrolledStudents": [
        {
          "_id": "student1",
          "name": "Student One",
          "email": "student1@example.com"
        }
      ],
      "createdAt": "2025-07-24T05:40:55.188Z"
    }
  ],
  "totalCourses": 3
}
```

### Update Course (Instructor Only)
```
PUT /api/courses/{courseId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Updated description",
  "price": 149.99
}
```

**Response (200):**
```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Advanced JavaScript",
    "description": "Updated description",
    "price": 149.99,
    "updatedAt": "2025-07-24T06:40:55.188Z"
  }
}
```

### Delete Course (Instructor Only)
```
DELETE /api/courses/{courseId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

### Enroll in Course (Student Only)
```
POST /api/courses/{courseId}/enroll
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Successfully enrolled in course",
  "course": {
    "id": "60f1b2b3c4d5e6f7a8b9c0d1",
    "title": "Introduction to JavaScript",
    "instructor": "John Instructor"
  }
}
```

### Get Enrolled Courses (Student Only)
```
GET /api/courses/student/enrolled
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "enrolledCourses": [
    {
      "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
      "title": "Introduction to JavaScript",
      "instructor": {
        "_id": "60f1b2b3c4d5e6f7a8b9c0d1",
        "name": "John Instructor"
      },
      "progress": 0,
      "enrolledAt": "2025-07-24T05:40:55.188Z"
    }
  ],
  "totalEnrolled": 3
}
```

### Get Course Categories (Public)
```
GET /api/courses/categories
```

**Response (200):**
```json
{
  "categories": [
    "Programming",
    "Data Science", 
    "Design",
    "Business",
    "Marketing"
  ]
}
```

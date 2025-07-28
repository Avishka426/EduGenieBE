# EduGenie Backend API

A comprehensive backend API for an educational platform built with TypeScript, Node.js, Express, and MongoDB. Features include user authentication, course management, AI-powered course recommendations using OpenAI GPT, and profile picture uploads via Cloudinary.

## 🚀 Features

- **User Authentication**: JWT-based registration and login system
- **Course Management**: CRUD operations for courses with instructor authorization
- **AI Recommendations**: GPT-powered course recommendations based on user goals
- **Profile Management**: Profile picture upload/delete with Cloudinary integration
- **Role-based Access Control**: Student, Instructor, and Admin roles
- **Real-time Logging**: Comprehensive request/response logging
- **Production Ready**: Deployed on Railway with MongoDB Atlas

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration and setup
├── config/
│   ├── database.ts        # MongoDB connection configuration
│   └── cloudinary.ts      # Cloudinary setup for image uploads
├── controllers/
│   ├── authController.ts  # Authentication (register, login)
│   ├── courseController.ts # Course CRUD operations
│   ├── gptController.ts   # AI recommendation endpoints
│   ├── profileController.ts # Profile picture management
│   └── userController.ts  # User management operations
├── middleware/
│   ├── auth.ts           # JWT authentication middleware
│   └── logger.ts         # Request/response logging
├── models/
│   ├── userModel.ts      # User schema and model
│   └── courseModel.ts    # Course schema and model
├── routes/
│   ├── authRoutes.ts     # Authentication endpoints
│   ├── courseRoutes.ts   # Course management endpoints
│   ├── gptRoutes.ts      # AI recommendation endpoints
│   ├── profileRoutes.ts  # Profile management endpoints
│   └── userRoutes.ts     # User management endpoints
├── services/
│   └── gptService.ts     # OpenAI GPT integration service
└── types/
    └── index.ts          # TypeScript type definitions
```

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd EduGenieBE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   Then update the `.env` file with your actual configuration values.

## ⚙️ Environment Variables

Required environment variables (see `.env.example` for details):

```properties
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS
CLIENT_URL=http://localhost:8081

# Cloudinary (for profile pictures)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# OpenAI (for AI recommendations)
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Using Batch Files (Windows)
```bash
# Development
start-dev.bat

# Production
start-prod.bat
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Course Management
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (instructor only)
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)

### AI Recommendations
- `POST /api/gpt/recommendations` - Get AI course recommendations
- `GET /api/gpt/usage` - Get API usage statistics
- `GET /api/gpt/popular` - Get popular courses
- `GET /api/gpt/health` - Health check

### Profile Management
- `POST /api/profile/upload-picture` - Upload profile picture
- `DELETE /api/profile/delete-picture` - Delete profile picture

### User Management
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **File Storage**: Cloudinary for image uploads
- **Deployment**: Railway (Production), MongoDB Atlas (Database)

## 📋 Development Scripts

```bash
npm run dev        # Start development server with nodemon
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run clean      # Clean dist folder
```

## 🌐 Production Deployment

The application is configured for deployment on Railway:
- Environment variables are set in Railway dashboard
- MongoDB Atlas is used for production database
- Automatic deployments from GitHub repository

## 📝 Documentation

- `API-COMPLETE.md` - Complete API documentation
- `FRONTEND_INTEGRATION_GUIDE.md` - Frontend integration guide
- `DEPLOY.md` - Deployment instructions

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- CORS configuration
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
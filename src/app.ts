import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import profileRoutes from './routes/profileRoutes';
import gptRoutes from './routes/gptRoutes';
import { requestLogger, errorLogger } from './middleware/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Request logging middleware (add before other middleware)
app.use(requestLogger);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8081', // Expo default port
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/gpt', gptRoutes);
// Alternative profile routes under auth for convenience
app.use('/api/auth/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        message: 'EduGenie Backend is running!', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'EduGenie API v1.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile (requires auth)'
            },
            users: {
                getAllUsers: 'GET /api/users (admin only)',
                getUserById: 'GET /api/users/:id (requires auth)',
                updateProfile: 'PUT /api/users/profile (requires auth)',
                getUsersByRole: 'GET /api/users/role/:role (instructor/admin)',
                changeUserRole: 'PUT /api/users/:id/role (admin only)',
                deleteUser: 'DELETE /api/users/:id (admin only)'
            },
            gpt: {
                recommendations: 'POST /api/gpt/recommendations (requires auth)',
                usage: 'GET /api/gpt/usage (requires auth)',
                popular: 'GET /api/gpt/popular (requires auth)',
                health: 'GET /api/gpt/health (requires auth)',
                resetCounter: 'POST /api/gpt/reset-counter (requires auth)'
            },
            courses: {
                getAllCourses: 'GET /api/courses',
                createCourse: 'POST /api/courses (instructor only)',
                getCourseById: 'GET /api/courses/:id',
                updateCourse: 'PUT /api/courses/:id (instructor only)',
                deleteCourse: 'DELETE /api/courses/:id (instructor only)'
            },
            profile: {
                uploadPicture: 'POST /api/profile/upload-picture (requires auth)',
                deletePicture: 'DELETE /api/profile/delete-picture (requires auth)'
            }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            message: `${field} already exists`
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }
    
    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Add error logging middleware
app.use(errorLogger);

app.listen(PORT, () => {
    console.log('\n' + '🎯'.repeat(50));
    console.log(`🚀 EduGenie Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 API docs: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔍 Real-time request/response logging: ENABLED`);
    console.log('🎯'.repeat(50) + '\n');
    console.log('⏳ Waiting for requests...\n');
});

export default app;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { AuthRequest } from '../types';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Access denied. No token provided.' });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as JwtPayload;
            
            // Fetch user from database
            const user = await User.findById(decoded.userId);
            if (!user) {
                res.status(401).json({ message: 'Invalid token. User not found.' });
                return;
            }

            // Attach user to request
            req.user = {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                password: '' // Don't expose password
            };

            next();
        } catch (jwtError) {
            res.status(401).json({ message: 'Invalid token.' });
            return;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Access denied. User not authenticated.' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ 
                message: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}` 
            });
            return;
        }

        next();
    };
};

// Specific role middlewares
export const requireStudent = authorize('student');
export const requireInstructor = authorize('instructor');
export const requireAdmin = authorize('admin');
export const requireInstructorOrAdmin = authorize('instructor', 'admin');

export default authenticate;
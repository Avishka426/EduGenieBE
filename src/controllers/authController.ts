import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthController {
    // Register new user
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, role }: RegisterRequest = req.body;

            // Validate input
            if (!email || !password || !name) {
                res.status(400).json({ message: 'Email, password, and name are required' });
                return;
            }

            if (password.length < 6) {
                res.status(400).json({ message: 'Password must be at least 6 characters long' });
                return;
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(409).json({ message: 'User with this email already exists' });
                return;
            }

            // Create new user (password will be hashed in pre-save middleware)
            const newUser = new User({ 
                email, 
                password,
                name,
                role: role || 'student'
            });
            
            await newUser.save();

            // Generate JWT token
            const token = this.generateToken(newUser._id.toString(), newUser.email, newUser.role);

            const response: AuthResponse = {
                message: 'User registered successfully',
                token,
                user: {
                    id: newUser._id.toString(),
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                }
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user' });
        }
    }

    // Login user
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginRequest = req.body;

            // Validate input
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            // Find user and include password for comparison
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Generate JWT token
            const token = this.generateToken(user._id.toString(), user.email, user.role);

            const response: AuthResponse = {
                message: 'Login successful',
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error logging in' });
        }
    }

    // Get current user profile
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?._id;
            
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    }

    // Logout user (invalidate token on client side)
    async logout(req: Request, res: Response): Promise<void> {
        try {
            // In a simple JWT implementation, logout is handled client-side
            // by removing the token from storage
            res.status(200).json({ 
                message: 'Logout successful',
                instructions: 'Please remove the token from client storage'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Error during logout' });
        }
    }

    // Generate JWT token
    private generateToken(userId: string, email: string, role: string): string {
        return jwt.sign(
            { 
                userId, 
                email, 
                role 
            },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '7d' }
        );
    }
}
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { AuthRequest } from '../types';

export class UserController {
    // Get all users (Admin only)
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.find().select('-password');
            res.status(200).json({
                message: 'Users retrieved successfully',
                users,
                count: users.length
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ message: 'Error retrieving users' });
        }
    }

    // Get user by ID
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const user = await User.findById(id).select('-password');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'User retrieved successfully',
                user
            });
        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({ message: 'Error retrieving user' });
        }
    }

    // Update user profile
    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            const { name, profilePicture } = req.body;

            // Validate input
            if (!name) {
                res.status(400).json({ message: 'Name is required' });
                return;
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { 
                    name,
                    profilePicture: profilePicture || ''
                },
                { 
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    }

    // Delete user (Admin only)
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'User deleted successfully',
                deletedUser: {
                    id: deletedUser._id,
                    email: deletedUser.email,
                    name: deletedUser.name
                }
            });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }

    // Get users by role (Admin/Instructor only)
    async getUsersByRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.params;
            
            if (!['student', 'instructor', 'admin'].includes(role)) {
                res.status(400).json({ message: 'Invalid role specified' });
                return;
            }

            const users = await User.find({ role: role as 'student' | 'instructor' | 'admin' }).select('-password');
            
            res.status(200).json({
                message: `${role}s retrieved successfully`,
                users,
                count: users.length
            });
        } catch (error) {
            console.error('Get users by role error:', error);
            res.status(500).json({ message: 'Error retrieving users by role' });
        }
    }

    // Change user role (Admin only)
    async changeUserRole(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['student', 'instructor', 'admin'].includes(role)) {
                res.status(400).json({ message: 'Invalid role specified' });
                return;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { role: role as 'student' | 'instructor' | 'admin' },
                { 
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: `User role updated to ${role} successfully`,
                user: updatedUser
            });
        } catch (error) {
            console.error('Change user role error:', error);
            res.status(500).json({ message: 'Error changing user role' });
        }
    }
}
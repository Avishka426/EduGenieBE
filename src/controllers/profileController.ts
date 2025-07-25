import { Response } from 'express';
import { User } from '../models/userModel';
import { AuthenticatedRequest } from '../types';
import { uploadToCloudinary, deleteProfileImage } from '../config/cloudinary';

export class ProfileController {
    // Upload profile picture for any user (student/instructor/admin)
    async uploadProfilePicture(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Check if file was uploaded
            if (!req.file) {
                res.status(400).json({ 
                    message: 'No image file provided',
                    hint: 'Make sure to send the file as "profilePicture" in form-data'
                });
                return;
            }

            console.log(`📸 Profile picture upload for user ${userId}:`, {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                sizeKB: Math.round(req.file.size / 1024)
            });

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Delete old profile picture if exists
            if (user.profilePicture) {
                console.log(`🗑️ Deleting old profile picture: ${user.profilePicture}`);
                await deleteProfileImage(user.profilePicture);
            }

            // Upload new image to Cloudinary
            console.log('☁️ Uploading to Cloudinary...');
            const uploadResult = await uploadToCloudinary(req.file.buffer, userId);
            console.log('✅ Cloudinary upload successful:', uploadResult.url);

            // Update user profile with new image URL
            user.profilePicture = uploadResult.url;
            await user.save();

            res.status(200).json({
                message: 'Profile picture uploaded successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                },
                imageDetails: {
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                    originalName: req.file.originalname,
                    size: req.file.size
                }
            });
        } catch (error: any) {
            console.error('❌ Upload profile picture error:', error);
            
            if (error.message.includes('File size too large')) {
                res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
            } else if (error.message.includes('Only image files')) {
                res.status(400).json({ message: 'Only image files are allowed.' });
            } else if (error.message.includes('Invalid image file')) {
                res.status(400).json({ message: 'Invalid image file format.' });
            } else {
                res.status(500).json({ 
                    message: 'Error uploading profile picture',
                    error: error.message 
                });
            }
        }
    }

    // Remove profile picture
    async removeProfilePicture(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Delete profile picture from Cloudinary if exists
            if (user.profilePicture) {
                await deleteProfileImage(user.profilePicture);
            }

            // Remove profile picture URL from user
            user.profilePicture = '';
            await user.save();

            res.status(200).json({
                message: 'Profile picture removed successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture
                }
            });
        } catch (error: any) {
            console.error('Remove profile picture error:', error);
            res.status(500).json({ 
                message: 'Error removing profile picture',
                error: error.message 
            });
        }
    }

    // Get user profile (including profile picture)
    async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } catch (error: any) {
            console.error('Get profile error:', error);
            res.status(500).json({ 
                message: 'Error fetching profile',
                error: error.message 
            });
        }
    }

    // Update profile information (name, etc.)
    async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            const { name } = req.body;
            
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Update name if provided
            if (name && name.trim()) {
                user.name = name.trim();
                await user.save();
            }

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } catch (error: any) {
            console.error('Update profile error:', error);
            res.status(500).json({ 
                message: 'Error updating profile',
                error: error.message 
            });
        }
    }
}

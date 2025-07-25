import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middleware/authMiddleware';
import { uploadProfileImage } from '../config/cloudinary';

const router = Router();
const profileController = new ProfileController();

// All profile routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/', profileController.getProfile.bind(profileController));

// Update profile information (name, etc.)
router.put('/', profileController.updateProfile.bind(profileController));

// Upload profile picture
router.post('/picture', 
    uploadProfileImage.single('profilePicture'), 
    profileController.uploadProfilePicture.bind(profileController)
);

// Remove profile picture
router.delete('/picture', profileController.removeProfilePicture.bind(profileController));

export default router;

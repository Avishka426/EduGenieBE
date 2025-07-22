import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, requireAdmin, requireInstructorOrAdmin } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Get all users (Admin only)
router.get('/', requireAdmin, userController.getAllUsers.bind(userController));

// Get user by ID (any authenticated user)
router.get('/:id', userController.getUserById.bind(userController));

// Update own profile (any authenticated user)
router.put('/profile', userController.updateProfile.bind(userController));

// Get users by role (Admin/Instructor only)
router.get('/role/:role', requireInstructorOrAdmin, userController.getUsersByRole.bind(userController));

// Change user role (Admin only)
router.put('/:id/role', requireAdmin, userController.changeUserRole.bind(userController));

// Delete user (Admin only)
router.delete('/:id', requireAdmin, userController.deleteUser.bind(userController));

export default router;
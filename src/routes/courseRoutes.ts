import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();
const courseController = new CourseController();

// Public routes
router.get('/', courseController.getAllCourses.bind(courseController)); // Get all published courses
router.get('/categories', courseController.getCourseCategories.bind(courseController)); // Get course categories
router.get('/:id', courseController.getCourseById.bind(courseController)); // Get course by ID

// Protected routes (authentication required)
router.post('/', authenticate, courseController.createCourse.bind(courseController)); // Create course (instructor)
router.get('/instructor/my-courses', authenticate, courseController.getInstructorCourses.bind(courseController)); // Get instructor's courses
router.get('/:id/students', authenticate, courseController.getCourseEnrolledStudents.bind(courseController)); // Get enrolled students (instructor)
router.put('/:id', authenticate, courseController.updateCourse.bind(courseController)); // Update course (instructor)
router.delete('/:id', authenticate, courseController.deleteCourse.bind(courseController)); // Delete course (instructor)

// Student enrollment routes
router.post('/:id/enroll', authenticate, courseController.enrollInCourse.bind(courseController)); // Enroll in course
router.get('/student/enrolled', authenticate, courseController.getEnrolledCourses.bind(courseController)); // Get enrolled courses

export default router;

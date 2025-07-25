import { Request, Response } from 'express';
import { Course } from '../models/courseModel';
import { User } from '../models/userModel';
import { AuthenticatedRequest } from '../types';

export class CourseController {
    // Create a new course (Instructors only)
    async createCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Check if user is instructor
            if (userRole !== 'instructor' && userRole !== 'admin') {
                res.status(403).json({ message: 'Only instructors can create courses' });
                return;
            }

            const {
                title,
                description,
                content,
                category,
                duration,
                level,
                price,
                thumbnail,
                tags,
                maxStudents
            } = req.body;

            // Validate required fields
            if (!title || !description || !content || !category || !duration || !level || price === undefined) {
                res.status(400).json({ 
                    message: 'Title, description, content, category, duration, level, and price are required' 
                });
                return;
            }

            // Get instructor details
            const instructor = await User.findById(userId);
            if (!instructor) {
                res.status(404).json({ message: 'Instructor not found' });
                return;
            }

            // Create new course
            const newCourse = new Course({
                title,
                description,
                instructor: userId,
                instructorName: instructor.name,
                content,
                category,
                duration,
                level,
                price,
                thumbnail,
                tags: tags || [],
                maxStudents,
                status: 'Draft'
            });

            await newCourse.save();

            res.status(201).json({
                message: 'Course created successfully',
                course: {
                    id: newCourse._id,
                    title: newCourse.title,
                    description: newCourse.description,
                    instructorName: newCourse.instructorName,
                    category: newCourse.category,
                    duration: newCourse.duration,
                    level: newCourse.level,
                    price: newCourse.price,
                    status: newCourse.status,
                    createdAt: newCourse.createdAt
                }
            });
        } catch (error) {
            console.error('Create course error:', error);
            res.status(500).json({ message: 'Error creating course' });
        }
    }

    // Get all courses (with filters)
    async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const { 
                category, 
                level, 
                status = 'Published',
                search,
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            // Build query
            const query: any = {};
            
            if (category) query.category = category;
            if (level) query.level = level;
            if (status) query.status = status;
            if (search) {
                query.$text = { $search: search as string };
            }

            // Calculate pagination
            const skip = (Number(page) - 1) * Number(limit);
            const sortOptions: any = {};
            sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

            // Get courses with pagination
            const courses = await Course.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit))
                .populate('instructor', 'name email')
                .select('-content'); // Exclude content from list view

            const totalCourses = await Course.countDocuments(query);
            const totalPages = Math.ceil(totalCourses / Number(limit));

            res.status(200).json({
                courses: courses.map(course => ({
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    instructorName: course.instructorName,
                    category: course.category,
                    duration: course.duration,
                    level: course.level,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    tags: course.tags,
                    enrollmentCount: course.enrolledStudents.length,
                    maxStudents: course.maxStudents,
                    status: course.status,
                    createdAt: course.createdAt
                })),
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalCourses,
                    hasNextPage: Number(page) < totalPages,
                    hasPrevPage: Number(page) > 1
                }
            });
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({ message: 'Error fetching courses' });
        }
    }

    // Get course by ID
    async getCourseById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const course = await Course.findById(id)
                .populate('instructor', 'name email')
                .populate('enrolledStudents', 'name email');

            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            }

            res.status(200).json({
                course: {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    instructor: course.instructor,
                    instructorName: course.instructorName,
                    content: course.content,
                    category: course.category,
                    duration: course.duration,
                    level: course.level,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    tags: course.tags,
                    enrolledStudents: course.enrolledStudents,
                    enrollmentCount: course.enrolledStudents.length,
                    maxStudents: course.maxStudents,
                    status: course.status,
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt
                }
            });
        } catch (error) {
            console.error('Get course error:', error);
            res.status(500).json({ message: 'Error fetching course' });
        }
    }

    // Get instructor's courses
    async getInstructorCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Check if user is instructor
            if (userRole !== 'instructor' && userRole !== 'admin') {
                res.status(403).json({ message: 'Access denied' });
                return;
            }

            const courses = await Course.find({ instructor: userId })
                .sort({ createdAt: -1 });

            res.status(200).json({
                courses: courses.map(course => ({
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    duration: course.duration,
                    level: course.level,
                    price: course.price,
                    enrollmentCount: course.enrolledStudents.length,
                    maxStudents: course.maxStudents,
                    status: course.status,
                    createdAt: course.createdAt
                }))
            });
        } catch (error) {
            console.error('Get instructor courses error:', error);
            res.status(500).json({ message: 'Error fetching instructor courses' });
        }
    }

    // Update course (Instructor only)
    async updateCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Find the course
            const course = await Course.findById(id);
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            }

            // Check if user is the instructor or admin
            if (userRole !== 'admin' && course.instructor.toString() !== userId?.toString()) {
                res.status(403).json({ message: 'You can only update your own courses' });
                return;
            }

            const {
                title,
                description,
                content,
                category,
                duration,
                level,
                price,
                thumbnail,
                tags,
                maxStudents,
                status
            } = req.body;

            // Update course
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(content && { content }),
                    ...(category && { category }),
                    ...(duration && { duration }),
                    ...(level && { level }),
                    ...(price !== undefined && { price }),
                    ...(thumbnail && { thumbnail }),
                    ...(tags && { tags }),
                    ...(maxStudents !== undefined && { maxStudents }),
                    ...(status && { status })
                },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                message: 'Course updated successfully',
                course: {
                    id: updatedCourse!._id,
                    title: updatedCourse!.title,
                    description: updatedCourse!.description,
                    category: updatedCourse!.category,
                    duration: updatedCourse!.duration,
                    level: updatedCourse!.level,
                    price: updatedCourse!.price,
                    status: updatedCourse!.status,
                    updatedAt: updatedCourse!.updatedAt
                }
            });
        } catch (error: any) {
            console.error('Update course error:', error);
            
            // Handle validation errors with more specific messages
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err: any) => {
                    if (err.path === 'status') {
                        return `Status must be one of: "Draft", "Published", "Archived" (case-sensitive). You sent: "${err.value}"`;
                    }
                    if (err.path === 'level') {
                        return `Level must be one of: "Beginner", "Intermediate", "Advanced" (case-sensitive). You sent: "${err.value}"`;
                    }
                    if (err.path === 'category') {
                        return `Invalid category. You sent: "${err.value}"`;
                    }
                    return err.message;
                });
                
                res.status(400).json({ 
                    message: 'Validation failed',
                    errors: validationErrors,
                    validValues: {
                        status: ['Draft', 'Published', 'Archived'],
                        level: ['Beginner', 'Intermediate', 'Advanced'],
                        category: ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'Database', 'DevOps', 'UI/UX Design', 'Business', 'Marketing', 'Other']
                    }
                });
                return;
            }
            
            res.status(500).json({ message: 'Error updating course' });
        }
    }

    // Delete course (Instructor only)
    async deleteCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Find the course
            const course = await Course.findById(id);
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            }

            // Check if user is the instructor or admin
            if (userRole !== 'admin' && course.instructor.toString() !== userId?.toString()) {
                res.status(403).json({ message: 'You can only delete your own courses' });
                return;
            }

            // Check if course has enrolled students
            if (course.enrolledStudents.length > 0) {
                res.status(400).json({ 
                    message: 'Cannot delete course with enrolled students. Archive it instead.' 
                });
                return;
            }

            await Course.findByIdAndDelete(id);

            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            console.error('Delete course error:', error);
            res.status(500).json({ message: 'Error deleting course' });
        }
    }

    // Enroll in course (Students only)
    async enrollInCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Check if user is student
            if (userRole !== 'student') {
                res.status(403).json({ message: 'Only students can enroll in courses' });
                return;
            }

            // Find the course
            const course = await Course.findById(id);
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            }

            // Check if course is published
            if (course.status !== 'Published') {
                res.status(400).json({ message: 'Course is not available for enrollment' });
                return;
            }

            // Check if already enrolled
            if (course.enrolledStudents.includes(userId!)) {
                res.status(400).json({ message: 'Already enrolled in this course' });
                return;
            }

            // Check if course is full
            if (course.maxStudents && course.enrolledStudents.length >= course.maxStudents) {
                res.status(400).json({ message: 'Course is full' });
                return;
            }

            // Enroll student
            course.enrolledStudents.push(userId!);
            await course.save();

            res.status(200).json({
                message: 'Successfully enrolled in course',
                enrollment: {
                    courseId: course._id,
                    courseTitle: course.title,
                    enrolledAt: new Date()
                }
            });
        } catch (error) {
            console.error('Enroll course error:', error);
            res.status(500).json({ message: 'Error enrolling in course' });
        }
    }

    // Get enrolled courses for student
    async getEnrolledCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Check if user is student
            if (userRole !== 'student') {
                res.status(403).json({ message: 'Only students can view enrolled courses' });
                return;
            }

            const courses = await Course.find({ 
                enrolledStudents: userId,
                status: 'Published'
            }).sort({ createdAt: -1 });

            res.status(200).json({
                enrolledCourses: courses.map(course => ({
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    instructorName: course.instructorName,
                    category: course.category,
                    duration: course.duration,
                    level: course.level,
                    thumbnail: course.thumbnail,
                    enrolledAt: course.createdAt // This would be better with actual enrollment date
                }))
            });
        } catch (error) {
            console.error('Get enrolled courses error:', error);
            res.status(500).json({ message: 'Error fetching enrolled courses' });
        }
    }

    // Get course categories (Public endpoint)
    async getCourseCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = [
                'Programming',
                'Web Development',
                'Mobile Development',
                'Data Science',
                'Machine Learning',
                'Cybersecurity',
                'Cloud Computing',
                'Database',
                'DevOps',
                'UI/UX Design',
                'Business',
                'Marketing',
                'Other'
            ];

            res.status(200).json({
                categories: categories.map(category => ({
                    id: category.toLowerCase().replace(/\s+/g, '-'),
                    name: category,
                    value: category
                }))
            });
        } catch (error) {
            console.error('Get course categories error:', error);
            res.status(500).json({ message: 'Error fetching course categories' });
        }
    }

    // Get enrolled students for a specific course (Instructor only)
    async getCourseEnrolledStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Debug logging
            console.log('🔍 DEBUG - getCourseEnrolledStudents:');
            console.log('  Course ID:', id);
            console.log('  User ID from token:', userId);
            console.log('  User role:', userRole);
            console.log('  User object:', req.user);

            // Check if user is instructor or admin
            if (userRole !== 'instructor' && userRole !== 'admin') {
                res.status(403).json({ message: 'Access denied' });
                return;
            }

            // Find the course
            const course = await Course.findById(id)
                .populate('enrolledStudents', 'name email createdAt')
                .populate('instructor', 'name email');

            if (!course) {
                res.status(404).json({ message: 'Course not found' });
                return;
            }

            // Debug logging for course details
            console.log('  Course instructor ID:', course.instructor);
            console.log('  Course instructor _id:', (course.instructor as any)?._id);
            console.log('  Course instructor _id toString():', (course.instructor as any)?._id?.toString());
            console.log('  User ID toString():', userId?.toString());
            console.log('  Are they equal?:', (course.instructor as any)?._id?.toString() === userId?.toString());

            // Check if user is the instructor or admin
            // Fix: Since instructor is populated, we need to access the _id property
            const courseInstructorId = (course.instructor as any)?._id?.toString();
            if (userRole !== 'admin' && courseInstructorId !== userId?.toString()) {
                console.log('❌ Authorization failed - instructor ID mismatch');
                
                res.status(403).json({ 
                    message: 'You can only view students for your own courses',
                    debug: {
                        courseInstructorId: courseInstructorId,
                        userIdFromToken: userId?.toString(),
                        userRole: userRole,
                        suggestion: 'Check if you are logged in as the correct instructor who created this course'
                    }
                });
                return;
            }

            console.log('✅ Authorization passed - returning enrolled students');
            
            res.status(200).json({
                course: {
                    id: course._id,
                    title: course.title,
                    instructorName: course.instructorName,
                    totalEnrolled: course.enrolledStudents.length,
                    maxStudents: course.maxStudents
                },
                enrolledStudents: course.enrolledStudents.map((student: any) => ({
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    enrolledAt: student.createdAt // This would be better with actual enrollment date
                }))
            });
        } catch (error) {
            console.error('❌ Get course enrolled students error:', error);
            res.status(500).json({ message: 'Error fetching enrolled students' });
        }
    }
}

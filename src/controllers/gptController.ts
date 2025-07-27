import { Request, Response } from 'express';
import { GPTService } from '../services/gptService';
import { Course } from '../models/courseModel';
import { AuthenticatedRequest } from '../types';

/**
 * GPT Controller for AI-powered course recommendations
 * 
 * Assessment Requirements:
 * - Maximum 250 API requests limit
 * - Request tracking and logging
 * - Graceful error handling
 * - No API calls within loops
 * - Clean, well-documented code
 */
export class GPTController {
    /**
     * Get AI-powered course recommendations based on user prompt
     * @route POST /api/gpt/recommendations
     */
    async getCourseRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { prompt } = req.body;
            const userId = req.user?._id;
            const userRole = req.user?.role;

            // Validate input
            if (!prompt || typeof prompt !== 'string') {
                res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Prompt is required and must be a string',
                        example: { prompt: "I want to be a software engineer, what courses should I follow?" }
                    }
                });
                return;
            }

            if (prompt.length < 10) {
                res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Prompt must be at least 10 characters long'
                    }
                });
                return;
            }

            if (prompt.length > 500) {
                res.status(400).json({ 
                    success: false,
                    error: {
                        message: 'Prompt must be less than 500 characters long'
                    }
                });
                return;
            }

            // Log the request for assessment tracking
            console.log(`🤖 GPT Recommendation Request from ${userRole} (${userId}): "${prompt}"`);

            // Get recommendations from GPT service
            const result = await GPTService.getCourseRecommendations(prompt, userId);

            // Log successful response
            console.log(`✅ Generated ${result.recommendations.length} course recommendations`);
            console.log(`📊 API calls used: ${result.apiCallsUsed}/250`);

            res.status(200).json({
                success: true,
                data: {
                    message: 'AI recommendations generated successfully',
                    prompt: prompt,
                    recommendations: result.recommendations.map(course => ({
                        id: course._id || course.id,
                        title: course.title,
                        description: course.description,
                        category: course.category,
                        level: course.level,
                        instructorName: course.instructorName,
                        duration: course.duration,
                        price: course.price,
                        recommendationReason: course.recommendationReason || 'Recommended by AI based on your goals'
                    })),
                    aiResponse: result.gptResponse,
                    metadata: {
                        totalAvailableCourses: result.availableCourses.length,
                        recommendationsCount: result.recommendations.length,
                        apiCallsUsed: result.apiCallsUsed,
                        remainingApiCalls: 250 - result.apiCallsUsed
                    }
                }
            });

        } catch (error: any) {
            console.error('❌ GPT Controller Error:', error);

            // Handle API limit exceeded error
            if (error.message.includes('API call limit')) {
                res.status(429).json({
                    success: false,
                    error: {
                        message: 'API request limit exceeded',
                        details: error.message,
                        maxRequests: 250,
                        currentUsage: GPTService.getApiUsage()
                    }
                });
                return;
            }

            // Handle OpenAI API errors
            if (error.code === 'invalid_api_key') {
                res.status(503).json({
                    success: false,
                    error: {
                        message: 'GPT service temporarily unavailable',
                        details: 'API configuration issue'
                    }
                });
                return;
            }

            // Generic error response
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error generating course recommendations',
                    details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                }
            });
        }
    }

    /**
     * Get current API usage statistics
     * @route GET /api/gpt/usage
     */
    async getApiUsage(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const usage = GPTService.getApiUsage();
            const userRole = req.user?.role;

            console.log(`📊 API Usage requested by ${userRole}`);

            // Check if approaching limit (warning at 80%)
            const usagePercentage = Math.round((usage.callsUsed / usage.maxCalls) * 100);
            const isApproachingLimit = usagePercentage >= 80;

            const responseData: any = {
                message: 'Usage statistics retrieved successfully',
                usage: {
                    callsUsed: usage.callsUsed,
                    remainingCalls: usage.remainingCalls,
                    maxCalls: usage.maxCalls,
                    usagePercentage: usagePercentage
                }
            };

            // Add warning if approaching limit
            if (isApproachingLimit) {
                responseData.warning = 'Approaching daily limit';
            }

            res.status(200).json({
                success: true,
                data: responseData
            });

        } catch (error: any) {
            console.error('❌ Error fetching API usage:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching API usage statistics',
                    details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                }
            });
        }
    }

    /**
     * Reset API call counter (for testing purposes only)
     * @route POST /api/gpt/reset-counter
     * @note Should be restricted to admin users in production
     */
    async resetApiCounter(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userRole = req.user?.role;

            // Only allow admin users to reset counter
            if (userRole !== 'admin') {
                res.status(403).json({
                    message: 'Access denied. Only admin users can reset the API counter.'
                });
                return;
            }

            console.log(`🔄 API counter reset requested by admin (${req.user?._id})`);

            GPTService.resetApiCounter();

            res.status(200).json({
                message: 'API call counter reset successfully',
                usage: GPTService.getApiUsage(),
                resetBy: req.user?._id,
                resetAt: new Date().toISOString()
            });

        } catch (error: any) {
            console.error('❌ Error resetting API counter:', error);
            res.status(500).json({
                message: 'Error resetting API counter',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    /**
     * Get popular courses based on enrollment count
     * @route GET /api/gpt/popular
     */
    async getPopularCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userRole = req.user?.role;
            console.log(`📊 Popular courses requested by ${userRole}`);

            // Get published courses sorted by enrollment count
            const courses = await Course.find({ status: 'Published' })
                .sort({ 'enrolledStudents': -1 }) // Sort by enrollment count descending
                .limit(6) // Top 6 courses
                .select('title description category level instructorName duration price enrolledStudents')
                .lean();

            const popularCourses = courses.map(course => ({
                id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                instructorName: course.instructorName,
                duration: course.duration,
                price: course.price,
                enrollmentCount: course.enrolledStudents?.length || 0,
                popularity: this.getPopularityLabel(course.enrolledStudents?.length || 0)
            }));

            res.status(200).json({
                success: true,
                data: {
                    message: 'Popular courses retrieved successfully',
                    courses: popularCourses,
                    metadata: {
                        totalCourses: popularCourses.length,
                        sortedBy: 'enrollment_count'
                    }
                }
            });

        } catch (error: any) {
            console.error('❌ Error fetching popular courses:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error fetching popular courses',
                    details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                }
            });
        }
    }

    /**
     * Helper method to get popularity label based on enrollment count
     */
    private getPopularityLabel(enrollmentCount: number): string {
        if (enrollmentCount >= 100) return 'Most Enrolled';
        if (enrollmentCount >= 50) return 'Highly Popular';
        if (enrollmentCount >= 25) return 'Popular';
        if (enrollmentCount >= 10) return 'Growing';
        return 'New Course';
    }

    /**
     * Health check endpoint for GPT service
     * @route GET /api/gpt/health
     */
    async healthCheck(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const usage = GPTService.getApiUsage();

            res.status(200).json({
                success: true,
                data: {
                    status: usage.remainingCalls > 0 ? 'operational' : 'limit_reached',
                    message: 'GPT service is healthy',
                    totalCalls: usage.callsUsed,
                    remainingCalls: usage.remainingCalls,
                    maxCalls: 250,
                    timestamp: new Date().toISOString(),
                    version: '1.0.0'
                }
            });

        } catch (error: any) {
            console.error('❌ GPT health check failed:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'GPT service health check failed',
                    details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                }
            });
        }
    }
}

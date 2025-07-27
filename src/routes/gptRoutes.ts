import { Router } from 'express';
import { GPTController } from '../controllers/gptController';
import { authenticate } from '../middleware/auth';

const router = Router();
const gptController = new GPTController();

// All GPT routes require authentication
router.use(authenticate);

/**
 * @route POST /api/gpt/recommendations
 * @desc Get AI-powered course recommendations based on user prompt
 * @access Private (requires authentication)
 * @body { prompt: string }
 */
router.post('/recommendations', gptController.getCourseRecommendations.bind(gptController));

/**
 * @route GET /api/gpt/usage
 * @desc Get current API usage statistics
 * @access Private (requires authentication)
 */
router.get('/usage', gptController.getApiUsage.bind(gptController));

/**
 * @route GET /api/gpt/popular
 * @desc Get popular courses based on enrollment count
 * @access Private (requires authentication)
 */
router.get('/popular', gptController.getPopularCourses.bind(gptController));

/**
 * @route GET /api/gpt/health
 * @desc Health check for GPT service
 * @access Private (requires authentication)
 */
router.get('/health', gptController.healthCheck.bind(gptController));

/**
 * @route POST /api/gpt/reset-counter
 * @desc Reset API call counter (for testing purposes only)
 * @access Private (requires authentication)
 * @note This should be removed in production or restricted to admin users
 */
router.post('/reset-counter', gptController.resetApiCounter.bind(gptController));

export default router;

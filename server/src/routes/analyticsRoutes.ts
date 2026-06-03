import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { getSalesChart, getPopularProducts } from '../controllers/analyticsController.js';

const router = Router();

// Secure all analytics routes to admin only
router.use(adminMiddleware);

/**
 * @swagger
 * /api/analytics/sales:
 *   get:
 *     summary: Get sales chart data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/sales', getSalesChart);

/**
 * @swagger
 * /api/analytics/popular-products:
 *   get:
 *     summary: Get popular products data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/popular-products', getPopularProducts);

export default router;

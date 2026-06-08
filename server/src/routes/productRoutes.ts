import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import { productImageUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

// ─── Public routes ────────────────────────────────────────────────────────────
// IMPORTANT: All literal/static routes MUST be declared before wildcard /:id
// routes. Express matches routes top-to-bottom; if /:id comes first, strings
// like "new-arrivals", "best-sellers", "admin" etc. get captured as the id.

router.get('/', productController.listProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/best-sellers', productController.getBestSellers);
router.get('/slug/:slug', productController.getProduct);

// ─── Admin routes (static paths — must stay above /:id) ──────────────────────
router.get('/admin/:id', adminMiddleware, productController.getProductByIdAdmin);
router.post('/', adminMiddleware, productController.createProduct);

// ─── Public wildcard ──────────────────────────────────────────────────────────
// Only placed here after all static routes are declared above
router.get('/:id', productController.getProductById);

// ─── Admin wildcard mutations ─────────────────────────────────────────────────
router.patch('/:id', adminMiddleware, productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);
router.post(
  '/:id/images',
  adminMiddleware,
  productImageUpload.array('images', 10),
  productController.uploadImages
);
router.patch('/:id/images/:imageId', adminMiddleware, productController.updateImage);
router.delete('/:id/images/:imageId', adminMiddleware, productController.deleteImage);

export default router;

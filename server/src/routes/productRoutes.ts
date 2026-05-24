import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import { productImageUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', productController.listProducts);
router.get('/slug/:slug', productController.getProduct);

// Admin
router.get('/admin/:id', adminMiddleware, productController.getProductById);
router.post('/', adminMiddleware, productController.createProduct);
router.patch('/:id', adminMiddleware, productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);
router.post(
  '/:id/images',
  adminMiddleware,
  productImageUpload.array('images', 10),
  productController.uploadImages
);
router.delete('/:id/images/:imageId', adminMiddleware, productController.deleteImage);

export default router;

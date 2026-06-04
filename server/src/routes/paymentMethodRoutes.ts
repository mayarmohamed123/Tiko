import { Router } from 'express';
import * as paymentMethodController from '../controllers/paymentMethodController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import { transactionUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public
router.get('/', paymentMethodController.getEnabledMethods);

// Admin Only
router.get('/admin', adminMiddleware, paymentMethodController.getAllMethods);
router.patch('/:id', adminMiddleware, paymentMethodController.updateMethod);
router.post(
  '/upload-qr',
  adminMiddleware,
  transactionUpload.single('image'),
  paymentMethodController.uploadQrCode
);

export default router;

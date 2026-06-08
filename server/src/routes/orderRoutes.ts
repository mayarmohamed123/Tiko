import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { transactionUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Checkout — optional auth (guest or logged-in)
router.post('/', (req, res, next) => {
  const token = req.cookies?.auth_token;
  if (token) {
    return authMiddleware(req, res, () => orderController.createOrder(req, res));
  }
  return orderController.createOrder(req, res);
});

// Temp transaction image upload — must be declared BEFORE /:id routes
// to prevent Express matching 'upload-transaction' as an :id param
router.post(
  '/upload-transaction',
  transactionUpload.single('image'),
  orderController.uploadTempTransactionImage
);

// Transaction image upload — public (guest may upload after order placed)
router.post(
  '/:id/transaction-image',
  transactionUpload.single('image'),
  orderController.uploadTransactionImage
);

// Admin
router.get('/stats', adminMiddleware, orderController.dashboardStats);
router.get('/', adminMiddleware, orderController.listOrders);
router.get('/:id', adminMiddleware, orderController.getOrder);
router.patch('/:id/status', adminMiddleware, orderController.updateStatus);
router.patch('/:id/payment', adminMiddleware, orderController.updatePayment);

export default router;

import { Router } from 'express';
import * as customerController from '../controllers/customerController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', adminMiddleware, customerController.listCustomers);
router.get('/:id', adminMiddleware, customerController.getCustomer);
router.delete('/:id', adminMiddleware, customerController.deleteCustomer);

export default router;

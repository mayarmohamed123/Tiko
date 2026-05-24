import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.post('/', adminMiddleware, categoryController.createCategory);
router.delete('/:id', adminMiddleware, categoryController.deleteCategory);

export default router;

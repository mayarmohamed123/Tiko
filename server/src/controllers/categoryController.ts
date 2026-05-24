import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';
import { paramId } from '../utils/params.js';
import { createCategorySchema } from '../schemas/productSchema.js';

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch {
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const category = await categoryService.createCategory(
      parsed.data.name,
      parsed.data.sortOrder
    );
    res.status(201).json(category);
  } catch {
    res.status(500).json({ message: 'Failed to create category.' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.softDeleteCategory(paramId(req.params.id));
    res.json({ message: 'Category deleted.' });
  } catch (e: unknown) {
    if ((e as Error).message === 'CATEGORY_HAS_PRODUCTS') {
      return res.status(409).json({ message: 'Category has active products.' });
    }
    res.status(500).json({ message: 'Failed to delete category.' });
  }
};

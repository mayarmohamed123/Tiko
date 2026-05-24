import { Request, Response } from 'express';
import * as productService from '../services/productService.js';
import { paramId } from '../utils/params.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchema.js';

export const listProducts = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).user?.role === 'ADMIN';
    const products = await productService.listProducts({
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
      admin,
    });
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductBySlug(paramId(req.params.slug));
    res.json(product);
  } catch (e: unknown) {
    if ((e as Error).message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(paramId(req.params.id));
    res.json(product);
  } catch (e: unknown) {
    if ((e as Error).message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const product = await productService.createProduct(parsed.data);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: 'Failed to create product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const product = await productService.updateProduct(paramId(req.params.id), parsed.data);
    res.json(product);
  } catch (e: unknown) {
    if ((e as Error).message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.softDeleteProduct(paramId(req.params.id));
    res.json({ message: 'Product deleted.' });
  } catch (e: unknown) {
    if ((e as Error).message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Failed to delete product.' });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    return res.status(400).json({ message: 'No images provided.' });
  }
  try {
    const images = await productService.addProductImages(paramId(req.params.id), files);
    res.status(201).json(images);
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === 'PRODUCT_NOT_FOUND') return res.status(404).json({ message: 'Product not found.' });
    if (msg === 'CLOUDINARY_NOT_CONFIGURED') {
      return res.status(503).json({ message: 'Image upload is not configured.' });
    }
    res.status(500).json({ message: 'Failed to upload images.' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    await productService.softDeleteProductImage(
      paramId(req.params.id),
      paramId(req.params.imageId)
    );
    res.json({ message: 'Image deleted.' });
  } catch (e: unknown) {
    if ((e as Error).message === 'IMAGE_NOT_FOUND') {
      return res.status(404).json({ message: 'Image not found.' });
    }
    res.status(500).json({ message: 'Failed to delete image.' });
  }
};

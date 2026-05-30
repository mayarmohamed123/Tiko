import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  material: z.string().min(1),
  categoryId: z.string().uuid(),
  description: z.string().min(1),
  price: z.number().positive(),
  stockQty: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(1).default(5),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  sku: z.string().optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export const updateImageSchema = z.object({
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
  altText: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

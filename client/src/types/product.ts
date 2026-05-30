import type { ProductAvailability, ProductStatus } from './common';

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ApiProduct {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  material: string;
  description: string;
  price: number;
  priceMinor: number;
  stock: number;
  stockQty: number;
  lowStockThreshold: number;
  category: string;
  categoryId: string;
  status: ProductStatus;
  colors: string[];
  sizes: string[];
  availability: ProductAvailability;
  image: string | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  material: string;
  categoryId: string;
  description: string;
  price: number;
  stockQty?: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  sku?: string;
  colors?: string[];
  sizes?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  material?: string;
  categoryId?: string;
  description?: string;
  price?: number;
  stockQty?: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  sku?: string;
  colors?: string[];
  sizes?: string[];
}

export interface ProductImageRecord {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

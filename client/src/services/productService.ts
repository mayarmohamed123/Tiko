import api from '../api/axios';
import type {
  ApiMessageResponse,
  ApiProduct,
  CreateProductRequest,
  ProductImageRecord,
  UpdateProductRequest,
} from '../types';

export const productService = {
  list: (params?: { categoryId?: string; search?: string }) =>
    api
      .get<ApiProduct[]>('/products', { params })
      .then((r) => r.data),

  newArrivals: () =>
    api.get<ApiProduct[]>('/products/new-arrivals').then((r) => r.data),

  bestSellers: () =>
    api.get<ApiProduct[]>('/products/best-sellers').then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<ApiProduct>(`/products/slug/${slug}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiProduct>(`/products/${id}`).then((r) => r.data),

  create: (data: CreateProductRequest) =>
    api.post<ApiProduct>('/products', data).then((r) => r.data),

  update: (id: string, data: UpdateProductRequest) =>
    api.patch<ApiProduct>(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete<ApiMessageResponse>(`/products/${id}`).then((r) => r.data),

  uploadImages: (productId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    return api
      .post<ProductImageRecord[]>(`/products/${productId}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  deleteImage: (productId: string, imageId: string) =>
    api
      .delete<ApiMessageResponse>(`/products/${productId}/images/${imageId}`)
      .then((r) => r.data),

  updateImage: (
    productId: string,
    imageId: string,
    data: { isPrimary?: boolean; sortOrder?: number; altText?: string }
  ) =>
    api
      .patch(`/products/${productId}/images/${imageId}`, data)
      .then((r) => r.data),
};

import api from '../api/axios';
import type { ApiMessageResponse, Category, CreateCategoryRequest } from '../types';

export const categoryService = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),

  create: (data: CreateCategoryRequest) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  remove: (id: string) =>
    api.delete<ApiMessageResponse>(`/categories/${id}`).then((r) => r.data),
};

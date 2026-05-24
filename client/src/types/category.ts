export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface CreateCategoryRequest {
  name: string;
  sortOrder?: number;
}

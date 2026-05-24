export interface ApiMessageResponse {
  message: string;
}

export interface ApiValidationError {
  message: string;
  errors?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ProductAvailability = 'available' | 'limited' | 'sold-out';

export type UserRole = 'ADMIN' | 'CUSTOMER';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'VISA' | 'INSTAPAY';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type CustomerStatus = 'active' | 'inactive';

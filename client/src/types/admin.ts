import type { ProductAvailability } from './common';
import type { ProductImage } from './product';

/** Row shape used by admin product table & form */
export interface AdminProduct {
  id: string;
  name: string;
  material: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  image: string | null;
  availability: ProductAvailability;
  description: string;
  colors?: string[];
  sizes?: string[];
  images?: ProductImage[];
}

export interface AdminOrder {
  id: string;
  orderId: string;
  customer: string;
  initials: string;
  date: string;
  status: string;
  statusRaw?: string;
  payment?: string;
  total: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
  address: string;
  avatarColor: string;
}

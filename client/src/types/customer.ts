import type { CustomerStatus } from './common';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  ordersCount: number;
  totalSpent: number;
  status: CustomerStatus;
  joinDate: string;
  userId: string | null;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  payment?: string;
  placedAt: string;
}

export interface CustomerDetail extends CustomerListItem {
  joinDate: string;
  orders: CustomerOrderSummary[];
}

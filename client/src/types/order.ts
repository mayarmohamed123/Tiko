import type { OrderStatus, PaginationMeta, PaymentMethod, PaymentStatus } from './common';

export interface OrderListItem {
  id: string;
  orderId: string;
  customer: string;
  initials: string;
  date: string;
  status: string;
  statusRaw: OrderStatus;
  payment?: string;
  total: number;
}

export interface OrdersListResponse {
  orders: OrderListItem[];
  pagination: PaginationMeta;
}

export interface DashboardStatsResponse {
  deliveredThisMonth: number;
  pendingFulfillment: number;
  averageOrderValue: number;
  recentOrders: OrderListItem[];
}

export interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productMaterial: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
}

export interface InstapayConfigSnapshot {
  email?: string;
  phone?: string;
  paymentLink?: string;
  qrCodeUrl?: string;
}

export interface PaymentDetail {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt: string | null;
  instapayReference: string | null;
  instapaySenderEmail: string | null;
  instapaySenderPhone: string | null;
  transactionImageUrl: string | null;
  instapayConfigSnapshot: InstapayConfigSnapshot | null;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  shippingFullName: string;
  shippingPhone: string;
  shippingStreet: string;
  currency: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  placedAt: string;
  items: OrderItemDetail[];
  payment: PaymentDetail | null;
  customer: { id: string; fullName: string; email: string } | null;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
  instapayReference?: string;
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number; selectedColor?: string; selectedSize?: string }[];
  shippingFullName: string;
  shippingPhone: string;
  shippingStreet: string;
  deliveryZoneCode?: string;
  paymentMethod: PaymentMethod;
  instapayReference?: string;
  notes?: string;
  guestEmail?: string;
  instapaySenderEmail?: string;
  instapaySenderPhone?: string;
  instapayScreenshotUrl?: string;
}

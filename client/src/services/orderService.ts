import api from '../api/axios';
import type {
  DashboardStatsResponse,
  OrderDetail,
  OrdersListResponse,
  UpdateOrderStatusRequest,
  UpdatePaymentStatusRequest,
  CreateOrderRequest,
} from '../types';
import type { PaymentDetail } from '../types/order';

export const orderService = {
  list: (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<OrdersListResponse>('/orders', { params }).then((r) => r.data),

  stats: () =>
    api.get<DashboardStatsResponse>('/orders/stats').then((r) => r.data),

  getById: (id: string) =>
    api.get<OrderDetail>(`/orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, data: UpdateOrderStatusRequest) =>
    api.patch(`/orders/${id}/status`, data).then((r) => r.data),

  updatePayment: (id: string, data: UpdatePaymentStatusRequest) =>
    api.patch<PaymentDetail>(`/orders/${id}/payment`, data).then((r) => r.data),

  create: (data: CreateOrderRequest) =>
    api.post<OrderDetail>('/orders', data).then((r) => r.data),

  uploadTransactionImage: (orderId: string, file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api
      .post<{ transactionImageUrl: string }>(`/orders/${orderId}/transaction-image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};

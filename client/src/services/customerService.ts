import api from '../api/axios';
import type { ApiMessageResponse, CustomerDetail, CustomerListItem } from '../types';

export const customerService = {
  list: (params?: { search?: string; status?: 'active' | 'inactive' }) =>
    api
      .get<CustomerListItem[]>('/customers', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<CustomerDetail>(`/customers/${id}`).then((r) => r.data),

  remove: (id: string) =>
    api.delete<ApiMessageResponse>(`/customers/${id}`).then((r) => r.data),
};

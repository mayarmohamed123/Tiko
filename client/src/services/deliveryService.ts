import api from '../api/axios';
import type { DeliveryZone } from '../types';

export interface AdminDeliveryZone extends DeliveryZone {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryZonePayload {
  name: string;
  code: string;
  fee: number; // EGP (decimal)
}

export interface UpdateDeliveryZonePayload {
  name?: string;
  code?: string;
  fee?: number;
  isActive?: boolean;
}

export const deliveryService = {
  /** Public: active zones only (used at checkout) */
  list: () => api.get<DeliveryZone[]>('/delivery-zones').then((r) => r.data),

  /** Admin: all zones including inactive */
  adminList: () =>
    api.get<AdminDeliveryZone[]>('/delivery-zones/admin').then((r) => r.data),

  /** Admin: create a new zone */
  create: (payload: CreateDeliveryZonePayload) =>
    api.post<AdminDeliveryZone>('/delivery-zones/admin', payload).then((r) => r.data),

  /** Admin: update zone fields */
  update: (id: string, payload: UpdateDeliveryZonePayload) =>
    api.put<AdminDeliveryZone>(`/delivery-zones/admin/${id}`, payload).then((r) => r.data),

  /** Admin: toggle isActive on/off */
  toggle: (id: string) =>
    api
      .patch<{ id: string; isActive: boolean }>(`/delivery-zones/admin/${id}/toggle`)
      .then((r) => r.data),

  /** Admin: soft-delete a zone */
  remove: (id: string) =>
    api.delete<{ message: string }>(`/delivery-zones/admin/${id}`).then((r) => r.data),
};

import api from '../api/axios';

export interface InstapayConfig {
  qrCodeUrl?: string;
  email?: string;
  phone?: string;
  paymentLink?: string;
}

export interface PaymentMethodConfig {
  id: string; // 'CASH' | 'INSTAPAY'
  name: string;
  isEnabled: boolean;
  config: InstapayConfig | Record<string, never>;
  createdAt: string;
  updatedAt: string;
}

export const paymentMethodService = {
  /** Public: only enabled methods (used on Checkout) */
  getEnabled: () =>
    api.get<PaymentMethodConfig[]>('/settings/payment-methods').then((r) => r.data),

  /** Admin: all methods regardless of enabled state */
  getAll: () =>
    api.get<PaymentMethodConfig[]>('/settings/payment-methods/admin').then((r) => r.data),

  /** Admin: toggle + update config for a single method */
  update: (id: string, payload: { isEnabled: boolean; config?: InstapayConfig }) =>
    api.patch<PaymentMethodConfig>(`/settings/payment-methods/${id}`, payload).then((r) => r.data),

  /** Admin: upload a QR code image and receive the hosted URL */
  uploadQrCode: (file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api
      .post<{ qrCodeUrl: string }>('/settings/payment-methods/upload-qr', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};

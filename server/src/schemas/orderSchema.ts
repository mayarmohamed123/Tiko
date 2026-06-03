import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingFullName: z.string().min(2),
  shippingPhone: z.string().min(8),
  shippingStreet: z.string().min(5),
  deliveryZoneCode: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'VISA', 'INSTAPAY']),
  instapayReference: z.string().optional(),
  notes: z.string().optional(),
  // Guest checkout — used when not logged in
  guestEmail: z.string().email().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED']),
  instapayReference: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

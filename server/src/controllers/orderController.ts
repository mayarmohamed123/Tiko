import { Request, Response } from 'express';
import * as orderService from '../services/orderService.js';
import { paramId } from '../utils/params.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from '../schemas/orderSchema.js';

export const listOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.listOrders({
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(paramId(req.params.id));
    res.json(order);
  } catch (e: unknown) {
    if ((e as Error).message === 'ORDER_NOT_FOUND') {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const order = await orderService.createOrder(parsed.data, userId);
    res.status(201).json(order);
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === 'INSUFFICIENT_STOCK') {
      return res.status(409).json({ message: 'Insufficient stock for one or more items.' });
    }
    if (msg === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (msg === 'INSTAPAY_REFERENCE_REQUIRED') {
      return res.status(400).json({ message: 'InstaPay reference is required.' });
    }
    res.status(500).json({ message: 'Failed to create order.' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const userId = (req as any).user?.userId;
    const order = await orderService.updateOrderStatus(
      paramId(req.params.id),
      parsed.data.status,
      userId,
      parsed.data.note
    );
    res.json(order);
  } catch (e: unknown) {
    if ((e as Error).message === 'ORDER_NOT_FOUND') {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(500).json({ message: 'Failed to update order.' });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  const parsed = updatePaymentStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }
  try {
    const payment = await orderService.updatePaymentStatus(
      paramId(req.params.id),
      parsed.data.status,
      parsed.data.instapayReference
    );
    res.json(payment);
  } catch (e: unknown) {
    if ((e as Error).message === 'PAYMENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Payment not found.' });
    }
    res.status(500).json({ message: 'Failed to update payment.' });
  }
};

export const dashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await orderService.getDashboardStats();
    res.json(stats);
  } catch {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

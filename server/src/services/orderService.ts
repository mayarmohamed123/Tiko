import type { OrderStatus, PaymentStatus } from '@prisma/client';
import prisma from '../config/db.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { findOrCreateCustomer } from './customerService.js';
import type { CreateOrderInput } from '../schemas/orderSchema.js';

const notDeleted = { deletedAt: null as null };

const statusLabel: Record<string, string> = {
  PENDING: 'Processing',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const paymentLabel: Record<string, string> = {
  CASH: 'Cash',
  VISA: 'Visa',
  INSTAPAY: 'InstaPay',
};

const formatOrderListItem = (order: {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  placedAt: Date;
  customer: { fullName: string } | null;
  payment: { method: string } | null;
}) => {
  const name = order.customer?.fullName ?? 'Guest';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return {
    id: order.orderNumber,
    orderId: order.id,
    customer: name,
    initials,
    date: order.placedAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: statusLabel[order.status] ?? order.status,
    statusRaw: order.status,
    payment: order.payment ? paymentLabel[order.payment.method] : undefined,
    total: order.totalAmount / 100,
  };
};

export const listOrders = async (params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { ...notDeleted };
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: 'insensitive' } },
      { customer: { fullName: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { placedAt: 'desc' },
      include: { customer: true, payment: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(formatOrderListItem),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: { id, ...notDeleted },
    include: {
      customer: true,
      payment: true,
      deliveryZone: true,
      items: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!order) throw new Error('ORDER_NOT_FOUND');
  return order;
};

export const createOrder = async (
  data: CreateOrderInput,
  userId?: string
) => {
  const productIds = data.items.map((i) => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, ...notDeleted, status: 'ACTIVE' },
    include: {
      images: { where: notDeleted, orderBy: { sortOrder: 'asc' }, take: 1 },
    },
  });

  if (products.length !== productIds.length) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of data.items) {
    const p = productMap.get(item.productId)!;
    if (p.stockQty < item.quantity) throw new Error('INSUFFICIENT_STOCK');
  }

  let deliveryFee = 350;
  let deliveryZoneId: string | undefined;
  if (data.deliveryZoneCode) {
    const zone = await prisma.deliveryZone.findFirst({
      where: { code: data.deliveryZoneCode, isActive: true, ...notDeleted },
    });
    if (zone) {
      deliveryFee = zone.fee;
      deliveryZoneId = zone.id;
    }
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  const taxRate = settings?.taxRate ?? 0;

  let subtotal = 0;
  const lineItems = data.items.map((item) => {
    const p = productMap.get(item.productId)!;
    const unitPrice = p.price;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;
    const primaryImage = p.images[0];
    return {
      productId: p.id,
      productName: p.name,
      productMaterial: p.material,
      selectedColor: item.selectedColor ?? null,
      selectedSize: item.selectedSize ?? null,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      imageUrl: primaryImage?.url ?? null,
    };
  });

  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + deliveryFee + taxAmount;

  let instapayConfigSnapshot: any = null;

  if (data.paymentMethod === 'INSTAPAY') {
    if (!data.instapayScreenshotUrl) {
      throw new Error('INSTAPAY_SCREENSHOT_REQUIRED');
    }
    if (
      (!data.instapaySenderEmail || !data.instapaySenderEmail.trim()) &&
      (!data.instapaySenderPhone || !data.instapaySenderPhone.trim())
    ) {
      throw new Error('INSTAPAY_SENDER_INFO_REQUIRED');
    }

    // Retrieve active Instapay config to snapshot it
    const instapayConfig = await prisma.paymentMethodConfig.findUnique({
      where: { id: 'INSTAPAY' },
    });
    if (instapayConfig && instapayConfig.config) {
      instapayConfigSnapshot = instapayConfig.config;
    }
  }

  let customerId: string | undefined;
  let orderUserId = userId;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const customer = await findOrCreateCustomer({
        userId: user.id,
        email: user.email,
        fullName: data.shippingFullName,
        phone: data.shippingPhone,
        address: data.shippingStreet,
      });
      if (customer.status === 'INACTIVE') {
        throw new Error('CUSTOMER_INACTIVE');
      }
      customerId = customer.id;
    }
  } else if (data.guestEmail) {
    const customer = await findOrCreateCustomer({
      email: data.guestEmail,
      fullName: data.shippingFullName,
      phone: data.shippingPhone,
      address: data.shippingStreet,
    });
    if (customer.status === 'INACTIVE') {
      throw new Error('CUSTOMER_INACTIVE');
    }
    customerId = customer.id;
  }

  const orderNumber = await generateOrderNumber(() => prisma.order.count());

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerId,
        userId: orderUserId,
        status: 'PENDING',
        shippingFullName: data.shippingFullName,
        shippingPhone: data.shippingPhone,
        shippingStreet: data.shippingStreet,
        deliveryZoneId,
        subtotal,
        deliveryFee,
        taxAmount,
        totalAmount,
        notes: data.notes,
        items: { create: lineItems },
        payment: {
          create: {
            method: data.paymentMethod,
            status: 'PENDING',
            amount: totalAmount,
            instapayReference: data.instapayReference,
            instapaySenderEmail: data.instapaySenderEmail,
            instapaySenderPhone: data.instapaySenderPhone,
            instapayConfigSnapshot: instapayConfigSnapshot,
            transactionImageUrl: data.instapayScreenshotUrl,
          },
        },
        statusHistory: {
          create: {
            toStatus: 'PENDING',
            changedByUserId: userId,
            note: 'Order placed',
          },
        },
      },
      include: { items: true, payment: true },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.totalAmount / 100,
    paymentMethod: (order as any).payment?.method,
  };
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  changedByUserId?: string,
  note?: string
) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, ...notDeleted } });
  if (!order) throw new Error('ORDER_NOT_FOUND');

  const updated = await prisma.$transaction(async (tx) => {
    const newStatus = status as OrderStatus;
    const result = await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { customer: true, payment: true },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: newStatus,
        changedByUserId,
        note,
      },
    });

    // Restore stock on cancel
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      const items = await tx.orderItem.findMany({ where: { orderId } });
      for (const item of items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { increment: item.quantity } },
          });
        }
      }
    }

    return result;
  });

  return formatOrderListItem(updated);
};

export const updatePaymentStatus = async (
  orderId: string,
  status: string,
  instapayReference?: string
) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new Error('PAYMENT_NOT_FOUND');

  const newStatus = status as PaymentStatus;
  return prisma.payment.update({
    where: { orderId },
    data: {
      status: newStatus,
      paidAt: newStatus === 'PAID' ? new Date() : undefined,
      instapayReference: instapayReference ?? payment.instapayReference,
    },
  });
};

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [deliveredThisMonth, pendingCount, revenueAgg, recentOrders] =
    await Promise.all([
      prisma.order.count({
        where: {
          ...notDeleted,
          status: 'DELIVERED',
          placedAt: { gte: startOfMonth },
        },
      }),
      prisma.order.count({
        where: { ...notDeleted, status: { in: ['PENDING', 'PROCESSING'] } },
      }),
      prisma.order.aggregate({
        where: { ...notDeleted, status: { not: 'CANCELLED' } },
        _avg: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: notDeleted,
        take: 5,
        orderBy: { placedAt: 'desc' },
        include: { customer: true, payment: true },
      }),
    ]);

  return {
    deliveredThisMonth,
    pendingFulfillment: pendingCount,
    averageOrderValue: (revenueAgg._avg.totalAmount ?? 0) / 100,
    recentOrders: recentOrders.map(formatOrderListItem),
  };
};

export const saveTransactionImageUrl = async (
  orderId: string,
  url: string
) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new Error('ORDER_NOT_FOUND');
  return prisma.payment.update({
    where: { orderId },
    data: { transactionImageUrl: url },
  });
};

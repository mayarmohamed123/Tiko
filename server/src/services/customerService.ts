import prisma from '../config/db.js';

const notDeleted = { deletedAt: null as null };

export const listCustomers = async (params: {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}) => {
  const where: Record<string, unknown> = { ...notDeleted };
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { fullName: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        where: { ...notDeleted, status: { not: 'CANCELLED' } },
        select: { totalAmount: true },
      },
    },
  });

  return customers.map((c) => {
    const ordersCount = c.orders.length;
    const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0) / 100;
    return {
      id: c.id,
      name: c.fullName,
      email: c.email,
      phone: c.phone,
      address: c.defaultAddress,
      ordersCount,
      totalSpent,
      status: c.status.toLowerCase(),
      joinDate: c.createdAt.toISOString().split('T')[0],
      userId: c.userId,
    };
  });
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findFirst({
    where: { id, ...notDeleted },
    include: {
      orders: {
        where: notDeleted,
        orderBy: { placedAt: 'desc' },
        take: 20,
        include: { payment: true },
      },
    },
  });
  if (!customer) throw new Error('CUSTOMER_NOT_FOUND');

  const ordersCount = customer.orders.filter((o) => o.status !== 'CANCELLED').length;
  const totalSpent =
    customer.orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0) / 100;

  return {
    id: customer.id,
    name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.defaultAddress,
    ordersCount,
    totalSpent,
    status: customer.status.toLowerCase(),
    joinDate: customer.createdAt,
    orders: customer.orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.totalAmount / 100,
      payment: o.payment?.method,
      placedAt: o.placedAt,
    })),
  };
};

export const findOrCreateCustomer = async (params: {
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  userId?: string;
}) => {
  const existing = await prisma.customer.findFirst({
    where: {
      ...notDeleted,
      OR: [
        params.userId ? { userId: params.userId } : undefined,
        { email: params.email },
      ].filter(Boolean) as object[],
    },
  });

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        fullName: params.fullName,
        phone: params.phone ?? existing.phone,
        defaultAddress: params.address ?? existing.defaultAddress,
        userId: params.userId ?? existing.userId,
      },
    });
  }

  return prisma.customer.create({
    data: {
      email: params.email,
      fullName: params.fullName,
      phone: params.phone,
      defaultAddress: params.address,
      userId: params.userId,
    },
  });
};

export const softDeleteCustomer = async (id: string) => {
  await prisma.customer.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'INACTIVE' },
  });
};

export const updateCustomerStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const customer = await prisma.customer.findFirst({
    where: { id, ...notDeleted },
  });
  if (!customer) throw new Error('CUSTOMER_NOT_FOUND');

  const updated = await prisma.customer.update({
    where: { id },
    data: { status },
  });

  return {
    id: updated.id,
    name: updated.fullName,
    email: updated.email,
    phone: updated.phone,
    address: updated.defaultAddress,
    status: updated.status.toLowerCase(),
  };
};

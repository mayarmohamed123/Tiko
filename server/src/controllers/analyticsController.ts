import { Request, Response } from 'express';
import prisma from '../config/db.js';

/**
 * Helper to get the start date based on days param
 */
const getStartDate = (daysStr?: string): Date | undefined => {
  if (!daysStr) return undefined;
  const days = parseInt(daysStr, 10);
  if (isNaN(days) || days <= 0) return undefined;
  
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const getSalesChart = async (req: Request, res: Response) => {
  try {
    const daysStr = req.query.days as string | undefined;
    const startDate = getStartDate(daysStr);

    const whereClause: any = {
      status: { not: 'CANCELLED' },
      deletedAt: null,
    };
    if (startDate) {
      whereClause.placedAt = { gte: startDate };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        placedAt: true,
        totalAmount: true,
      },
      orderBy: { placedAt: 'asc' },
    });

    const grouped = orders.reduce((acc: Record<string, { date: string; revenue: number; count: number }>, order: any) => {
      const dateStr = order.placedAt.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, revenue: 0, count: 0 };
      }
      acc[dateStr].revenue += order.totalAmount / 100; // Convert to major units
      acc[dateStr].count += 1;
      return acc;
    }, {} as Record<string, { date: string; revenue: number; count: number }>);

    const result = Object.values(grouped);
    res.json(result);
  } catch (error) {
    console.error('Error fetching sales chart data:', error);
    res.status(500).json({ message: 'Failed to fetch sales data' });
  }
};

export const getPopularProducts = async (req: Request, res: Response) => {
  try {
    const daysStr = req.query.days as string | undefined;
    const startDate = getStartDate(daysStr);

    const whereClause: any = {
      order: {
        status: { not: 'CANCELLED' },
        deletedAt: null,
      },
    };
    if (startDate) {
      whereClause.order.placedAt = { gte: startDate };
    }

    const orderItems = await prisma.orderItem.findMany({
      where: whereClause,
      select: {
        productId: true,
        productName: true,
        quantity: true,
        lineTotal: true,
      },
    });

    // Aggregate by productId/productName
    const aggregated = orderItems.reduce((acc: Record<string, { id: string; name: string; quantitySold: number; revenue: number }>, item: any) => {
      const key = item.productId || item.productName; // Fallback to name if product deleted
      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: item.productName,
          quantitySold: 0,
          revenue: 0,
        };
      }
      acc[key].quantitySold += item.quantity;
      acc[key].revenue += item.lineTotal / 100;
      return acc;
    }, {} as Record<string, { id: string; name: string; quantitySold: number; revenue: number }>);

    const result = Object.values(aggregated)
      .sort((a: any, b: any) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    res.status(500).json({ message: 'Failed to fetch popular products' });
  }
};

import api from '../api/axios';

export interface SalesDataPoint {
  date: string;
  revenue: number;
  count: number;
}

export interface PopularProduct {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export const analyticsService = {
  getSalesChart: (days?: number) =>
    api
      .get<SalesDataPoint[]>('/analytics/sales', { params: days ? { days } : undefined })
      .then((r) => r.data),

  getPopularProducts: (days?: number) =>
    api
      .get<PopularProduct[]>('/analytics/popular-products', { params: days ? { days } : undefined })
      .then((r) => r.data),
};

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader, type DayRange } from '../components/dashboard/AdminHeader';
import { StatCards } from '../components/dashboard/StatCards';
import { OrdersTable } from '../components/dashboard/OrdersTable';
import { SalesChart } from '../components/dashboard/SalesChart';
import { PopularProducts } from '../components/dashboard/PopularProducts';
import { PageLoader } from '../components/common/PageLoader';
import { orderService, analyticsService } from '../services';
import { mapOrderListItemToAdmin } from '../utils/adminMappers';
import { getErrorMessage } from '../utils/getErrorMessage';

/** Convert a flat list of orders to CSV text */
const toCSV = (orders: ReturnType<typeof mapOrderListItemToAdmin>[]) => {
  const headers = [
    'Order #',
    'Customer',
    'Status',
    'Payment',
    'Total (EGP)',
    'Date',
  ];
  const rows = orders.map((o) => [
    o.orderId,
    o.customer,
    o.status,
    o.payment ?? '',
    (o.total / 100).toFixed(2),
    o.date,
  ]);
  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
  const csvContent = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  return `sep=,\n${csvContent}`;
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const DashboardOverview: React.FC = () => {
  const [days, setDays] = useState<DayRange>(30);
  const [isExporting, setIsExporting] = useState(false);

  // Stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: orderService.stats,
  });

  // Sales chart
  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ['analytics', 'sales', days],
    queryFn: () => analyticsService.getSalesChart(days || undefined),
  });

  // Popular products
  const { data: popularData = [], isLoading: popularLoading } = useQuery({
    queryKey: ['analytics', 'popular-products', days],
    queryFn: () => analyticsService.getPopularProducts(days || undefined),
  });

  // Recent orders (all time, for the table)
  const recentOrders = stats?.recentOrders.map(mapOrderListItemToAdmin) ?? [];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all orders for the selected timeframe for the export
      const result = await orderService.list({ limit: 1000 });
      const allOrders = result.orders.map(mapOrderListItemToAdmin);

      // If days > 0, filter to the selected timeframe
      const now = Date.now();
      const filtered =
        days > 0
          ? allOrders.filter((o) => {
              const ts = new Date(o.date).getTime();
              return now - ts <= days * 24 * 60 * 60 * 1000;
            })
          : allOrders;

      const dateStr = new Date().toISOString().split('T')[0];
      const label = days > 0 ? `last-${days}d` : 'all-time';
      downloadCSV(toCSV(filtered), `tiko-orders-${label}-${dateStr}.csv`);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <AdminHeader
        days={days}
        onDaysChange={setDays}
        onExport={handleExport}
        isExporting={isExporting}
      />
      <StatCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart - takes 2/3 width */}
        <div className="lg:col-span-2 bg-tiko-surface border border-tiko-outline-variant rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-outfit font-bold text-tiko-on-surface text-base">Revenue Over Time</h3>
              <p className="text-xs text-tiko-on-surface-variant mt-0.5">
                Daily revenue for{' '}
                {days === 0 ? 'all time' : `the last ${days} days`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-tiko-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6750A4] inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7DD3FC] inline-block" />
                Orders
              </span>
            </div>
          </div>
          <SalesChart data={salesData} isLoading={salesLoading} days={days || 365} />
        </div>

        {/* Popular Products - takes 1/3 width */}
        <div className="bg-tiko-surface border border-tiko-outline-variant rounded-2xl p-6">
          <h3 className="font-outfit font-bold text-tiko-on-surface text-base mb-1">Top Products</h3>
          <p className="text-xs text-tiko-on-surface-variant mb-4">
            Best sellers {days === 0 ? '(all time)' : `in the last ${days} days`}
          </p>
          <PopularProducts data={popularData} isLoading={popularLoading} />
        </div>
      </div>

      {/* Recent Orders Table */}
      {statsLoading ? (
        <PageLoader />
      ) : statsError ? (
        <p className="text-sm text-tiko-error">{getErrorMessage(statsError)}</p>
      ) : (
        <OrdersTable
          title="Recent Orders"
          orders={recentOrders}
          showSearch={false}
          showPagination={false}
        />
      )}
    </>
  );
};

export default DashboardOverview;

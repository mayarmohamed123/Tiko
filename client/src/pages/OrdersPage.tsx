import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { OrdersTable } from '../components/dashboard/OrdersTable';
import { PageLoader } from '../components/common/PageLoader';
import { orderService } from '../services';
import { mapOrderListItemToAdmin } from '../utils/adminMappers';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { OrderStatus } from '../types';

const STATUS_MAP: Record<string, OrderStatus | undefined> = {
  'All Statuses': undefined,
  Processing: 'PROCESSING',
  Shipped: 'SHIPPED',
  Delivered: 'DELIVERED',
  Cancelled: 'CANCELLED',
};

const OrdersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const { data: stats } = useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: orderService.stats,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', search],
    queryFn: () =>
      orderService.list({
        page: 1,
        limit: 1000,
        search: search || undefined,
      }),
  });

  const allOrders = data?.orders.map(mapOrderListItemToAdmin) ?? [];

  // Frontend status filtration
  const filteredOrders = statusFilter === 'All Statuses'
    ? allOrders
    : allOrders.filter((o) => o.statusRaw === STATUS_MAP[statusFilter]);

  const itemsPerPage = 10;
  const totalOrders = filteredOrders.length;

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Orders Management</h2>
          <p className="text-tiko-on-surface-variant text-sm">Live data from API.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Order ID or Name..."
              className="pl-10 pr-4 py-2 border border-tiko-outline-variant bg-tiko-surface rounded-tiko-sm text-sm w-full sm:w-64"
            />
          </div>
          <button
            type="button"
            disabled
            title="Export API not available"
            className="flex items-center space-x-2 opacity-50 border px-5 py-2 rounded-tiko-sm text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Delivered This Month"
          value={stats?.deliveredThisMonth ?? '—'}
          subtitle="From API"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-[#e8f3ea]"
        />
        <StatCard
          title="Pending Fulfillment"
          value={stats?.pendingFulfillment ?? '—'}
          subtitle="PENDING + PROCESSING"
          subtitleColor="text-[#8c4a32]"
          bgColor="bg-[#faeadd]"
        />
        <StatCard
          title="Average Order Value"
          value={
            stats ? `EGP ${stats.averageOrderValue.toFixed(2)}` : '—'
          }
          subtitle="All non-cancelled orders"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-[#f2efe9]"
        />
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-tiko-surface border border-tiko-outline-variant rounded-full px-4 py-2 text-sm"
        >
          {Object.keys(STATUS_MAP).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <p className="text-tiko-error text-sm">{getErrorMessage(error)}</p>
      ) : (
        <OrdersTable
          orders={paginatedOrders}
          showSearch={false}
          showFilters={false}
          showPagination={true}
          totalOrders={totalOrders}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default OrdersPage;

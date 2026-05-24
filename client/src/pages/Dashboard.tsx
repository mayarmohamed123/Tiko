import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader } from '../components/dashboard/AdminHeader';
import { StatCards } from '../components/dashboard/StatCards';
import { OrdersTable } from '../components/dashboard/OrdersTable';
import { FeatureUnavailable } from '../components/common/FeatureUnavailable';
import { PageLoader } from '../components/common/PageLoader';
import { orderService } from '../services';
import { mapOrderListItemToAdmin } from '../utils/adminMappers';
import { getErrorMessage } from '../utils/getErrorMessage';

const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: orderService.stats,
  });

  const recentOrders = stats?.recentOrders.map(mapOrderListItemToAdmin) ?? [];

  return (
    <>
      <AdminHeader />
      <StatCards />

      <div className="grid grid-cols-1 gap-4 mb-8">
        <FeatureUnavailable description="Sales chart: needs GET /api/analytics/sales (time-series). Popular products: needs GET /api/analytics/popular-products." />
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <p className="text-sm text-tiko-error">{getErrorMessage(error)}</p>
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

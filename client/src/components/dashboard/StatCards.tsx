import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatCard } from './StatCard';
import {
  ClipboardList,
  Package,
  CircleDollarSign,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { customerService, orderService, productService } from '../../services';

export const StatCards: React.FC = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productService.list(),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: orderService.stats,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: () => customerService.list(),
  });

  const lowStock = products.filter(
    (p) => p.availability === 'limited' || p.stockQty < p.lowStockThreshold
  ).length;

  const revenueEstimate = stats
    ? `EGP ${(stats.averageOrderValue * (stats.deliveredThisMonth + stats.pendingFulfillment)).toFixed(0)}`
    : '—';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      <StatCard
        title="Total Products"
        value={products.length}
        icon={<ClipboardList className="w-5 h-5" />}
        subtitle="Live from API"
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard
        title="Pending Orders"
        value={stats?.pendingFulfillment ?? '—'}
        icon={<Package className="w-5 h-5" />}
        subtitle="PENDING + PROCESSING"
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard
        title="Avg Order Value"
        value={stats ? `EGP ${stats.averageOrderValue.toFixed(2)}` : '—'}
        icon={<CircleDollarSign className="w-5 h-5" />}
        subtitle={`Est. volume ${revenueEstimate}`}
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard
        title="Customers"
        value={customers.length}
        icon={<Users className="w-5 h-5" />}
        subtitle="Registered profiles"
        subtitleColor="text-tiko-tertiary"
        className="h-40"
      />
      <StatCard
        title="Low Stock"
        value={`${lowStock} Items`}
        icon={<AlertTriangle className="w-5 h-5" />}
        subtitle="stock &lt; 5 threshold"
        subtitleColor="text-tiko-error"
        bgColor="bg-tiko-surface"
        borderColor="border-tiko-error-container"
        className="h-40"
      />
    </div>
  );
};

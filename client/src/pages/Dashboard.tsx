import React from 'react';
import { AdminHeader } from '../components/dashboard/AdminHeader';
import { StatCards } from '../components/dashboard/StatCards';
import { SalesAnalyticsChart } from '../components/dashboard/SalesAnalyticsChart';
import { PopularProductsList } from '../components/dashboard/PopularProductsList';
import { OrdersTable } from '../components/dashboard/OrdersTable';

const DashboardOverview: React.FC = () => {
  const recentOrders = [
    { id: '#TK-9021', customer: 'Julianne Halloway', initials: 'JH', date: 'Oct 24, 2024', status: 'Delivered', total: 128.50 },
    { id: '#TK-9022', customer: 'Marcus Aurelius', initials: 'MA', date: 'Oct 24, 2024', status: 'Processing', total: 540.00 },
    { id: '#TK-9023', customer: 'Elena Loft', initials: 'EL', date: 'Oct 23, 2024', status: 'Delivered', total: 89.00 },
    { id: '#TK-9024', customer: 'Sarah Waters', initials: 'SW', date: 'Oct 23, 2024', status: 'Shipped', total: 2100.00 },
  ];

  return (
    <>
      <AdminHeader />
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <SalesAnalyticsChart />
        <PopularProductsList />
      </div>

      <OrdersTable 
        title="Recent Orders"
        orders={recentOrders}
        showSearch={true}
        showPagination={false}
      />
    </>
  );
};

export default DashboardOverview;

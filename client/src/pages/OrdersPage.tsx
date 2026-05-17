import React, { useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { OrdersTable, type Order } from '../components/dashboard/OrdersTable';
import { Download } from 'lucide-react';

const allOrders: Order[] = [
  { id: '#TK-9025', customer: 'Elena Jenkins', initials: 'EJ', date: 'Oct 24, 2024', status: 'Delivered', payment: 'Visa', total: 142.00 },
  { id: '#TK-9026', customer: 'Marcus Bennett', initials: 'MB', date: 'Oct 25, 2024', status: 'Processing', payment: 'COD', total: 84.50 },
  { id: '#TK-9027', customer: 'Sophia Wallace', initials: 'SW', date: 'Oct 25, 2024', status: 'Shipped', payment: 'Visa', total: 210.00 },
  { id: '#TK-9028', customer: 'Liam Grant', initials: 'LG', date: 'Oct 24, 2024', status: 'Cancelled', payment: 'Mastercard', total: 45.00 },
  { id: '#TK-9029', customer: 'Oliver Chen', initials: 'OC', date: 'Oct 26, 2024', status: 'Processing', payment: 'Apple Pay', total: 328.00 },
];

const OrdersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Orders Management</h2>
          <p className="text-tiko-on-surface-variant text-sm">Track and fulfill your neighborhood's latest requests.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by Order ID or Name..." 
              className="pl-10 pr-4 py-2 border border-tiko-outline-variant bg-tiko-surface rounded-tiko-sm text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary focus:border-transparent w-full sm:w-64"
            />
            <svg className="w-4 h-4 text-tiko-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="flex items-center space-x-2 bg-tiko-surface border border-tiko-outline-variant px-5 py-2 rounded-tiko-sm text-sm font-medium text-tiko-on-surface hover:bg-tiko-surface-container transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Stats Cards at the Top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Delivered This Month"
          value="312"
          subtitle="+12% vs last mo."
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-[#e8f3ea]"
          borderColor="border-transparent"
        />
        <StatCard 
          title="Pending Fulfillment"
          value="24"
          subtitle="Priority"
          subtitleColor="text-[#8c4a32]"
          bgColor="bg-[#faeadd]"
          borderColor="border-transparent"
        />
        <StatCard 
          title="Average Order Value"
          value="$142.50"
          subtitle="Stable"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-[#f2efe9]"
          borderColor="border-transparent"
        />
      </div>

      <OrdersTable 
        orders={allOrders}
        showSearch={false}
        showFilters={true}
        showPagination={true}
        totalOrders={48}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={5}
      />
    </div>
  );
};

export default OrdersPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AdminOrder } from '../../types/admin';
import OrderDetailModal from './OrderDetailModal';

export type Order = AdminOrder;

interface OrdersTableProps {
  title?: string;
  orders: Order[];
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  totalOrders?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  title,
  orders,
  showSearch = false,
  showFilters = false,
  showPagination = false,
  totalOrders = 0,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 5
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'; 
      case 'Processing': return 'bg-orange-100 text-orange-700';
      case 'Shipped': return 'bg-tiko-surface-container-highest text-tiko-on-surface-variant'; // or something grey/brown
      case 'Cancelled': return 'bg-gray-200 text-gray-700';
      default: return 'bg-tiko-surface-container text-tiko-on-surface-variant';
    }
  };

  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high shadow-sm overflow-hidden flex flex-col">
      {(title || showSearch) && (
        <div className="p-6 border-b border-tiko-surface-container-high flex flex-col sm:flex-row justify-between sm:items-center bg-tiko-surface gap-4">
          {title && <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">{title}</h3>}
          {showSearch && (
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 border border-tiko-outline-variant bg-tiko-surface rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary focus:border-transparent w-full sm:w-64"
              />
              <svg className="w-4 h-4 text-tiko-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <div className="p-4 border-b border-tiko-surface-container-high bg-tiko-background flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-tiko-on-surface-variant">
            <span className="font-bold text-tiko-on-surface">Status:</span>
            <select className="bg-tiko-surface border border-tiko-outline-variant rounded-full px-4 py-1.5 focus:outline-none">
              <option>All Statuses</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-tiko-on-surface-variant">
            <span className="font-bold text-tiko-on-surface">Date Range:</span>
            <div className="flex items-center gap-2">
              <input type="date" className="bg-tiko-surface border border-tiko-outline-variant rounded-full px-4 py-1.5 focus:outline-none" />
              <span>—</span>
              <input type="date" className="bg-tiko-surface border border-tiko-outline-variant rounded-full px-4 py-1.5 focus:outline-none" />
            </div>
          </div>
          <button className="text-tiko-primary font-bold hover:underline ml-auto">Clear all filters</button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-tiko-surface-container">
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Status</th>
              {orders.some(o => o.payment) && (
                <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Payment</th>
              )}
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tiko-surface-container-high">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-tiko-surface-container-low transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-tiko-on-surface">{order.id}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-tiko-surface-container-high text-tiko-primary flex items-center justify-center text-xs font-bold">
                      {order.initials}
                    </div>
                    <span className="text-sm text-tiko-on-surface font-medium">{order.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-tiko-on-surface-variant">{order.date}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                {orders.some(o => o.payment) && (
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-tiko-on-surface-variant flex items-center gap-2">
                    {order.payment}
                  </td>
                )}
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-tiko-on-surface">{order.total.toFixed(2)} EGP</td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className="text-tiko-primary hover:text-tiko-primary-container font-bold text-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showPagination ? (
        <div className="p-4 bg-tiko-background border-t border-tiko-surface-container-high flex items-center justify-between">
          <p className="text-sm text-tiko-on-surface-variant">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalOrders)}</span> of <span className="font-medium">{totalOrders}</span> orders
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-tiko-on-surface-variant hover:bg-tiko-surface-container-high disabled:opacity-50"
            >
              &lt;
            </button>
            {[1, 2, 3].map(page => (
              <button 
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                  currentPage === page 
                    ? 'bg-tiko-primary text-tiko-on-primary' 
                    : 'text-tiko-on-surface-variant hover:bg-tiko-surface-container-high'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => onPageChange?.(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-tiko-on-surface-variant hover:bg-tiko-surface-container-high"
            >
              &gt;
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-tiko-background border-t border-tiko-surface-container-high text-center">
          <Link to="/dashboard/orders" className="text-sm font-bold text-tiko-primary hover:text-tiko-primary-container">
            View All Orders
          </Link>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

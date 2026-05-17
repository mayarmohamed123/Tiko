import React from 'react';
import { MoreVertical } from 'lucide-react';

const recentOrders = [
  { id: '#TK-9021', customer: 'Julianne Halloway', initials: 'JH', date: 'Oct 24, 2024', status: 'Delivered', total: 128.50 },
  { id: '#TK-9022', customer: 'Marcus Aurelius', initials: 'MA', date: 'Oct 24, 2024', status: 'Processing', total: 540.00 },
  { id: '#TK-9023', customer: 'Elena Loft', initials: 'EL', date: 'Oct 23, 2024', status: 'Delivered', total: 89.00 },
  { id: '#TK-9024', customer: 'Sarah Waters', initials: 'SW', date: 'Oct 23, 2024', status: 'Shipped', total: 2100.00 },
];

export const RecentOrdersTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'; 
      case 'Processing': return 'bg-orange-100 text-orange-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-tiko-surface-container text-tiko-on-surface-variant';
    }
  };

  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high shadow-sm overflow-hidden">
      <div className="p-6 border-b border-tiko-surface-container-high flex justify-between items-center bg-tiko-surface">
        <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Recent Orders</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-10 pr-4 py-2 border border-tiko-outline-variant bg-tiko-surface rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary focus:border-transparent w-64"
          />
          <svg className="w-4 h-4 text-tiko-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-tiko-surface-container">
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tiko-surface-container-high">
            {recentOrders.map(order => (
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
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-tiko-on-surface">${order.total.toFixed(2)}</td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-tiko-on-surface-variant hover:text-tiko-on-surface">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-tiko-background border-t border-tiko-surface-container-high text-center">
        <button className="text-sm font-bold text-tiko-primary hover:text-tiko-primary-container">
          View All Orders
        </button>
      </div>
    </div>
  );
};

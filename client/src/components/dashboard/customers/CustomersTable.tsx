import React from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import type { AdminCustomer } from '../../../types/admin';

export type Customer = AdminCustomer;

interface CustomersTableProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  onViewDetails,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high shadow-sm overflow-hidden font-dm-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-tiko-surface-container border-b border-tiko-surface-container-high">
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Orders</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tiko-surface-container-high">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-tiko-on-surface-variant/60 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-tiko-outline" />
                    <p>No customers found matching the filter or search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-tiko-surface-container-low transition-colors">
                  {/* Avatar & Personal info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border border-tiko-outline-variant/65 ${cust.avatarColor} text-tiko-on-surface`}>
                        {getInitials(cust.name)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-tiko-on-surface">{cust.name}</h4>
                        <p className="text-xs text-tiko-on-surface-variant">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cust.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-tiko-surface-container-highest text-tiko-on-surface-variant'
                    }`}>
                      {cust.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tiko-on-surface font-medium">
                    {cust.ordersCount} orders
                  </td>

                  {/* Total Spent */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-tiko-primary">
                    {cust.totalSpent.toFixed(2)} EGP
                  </td>

                  {/* Join Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tiko-on-surface-variant">
                    {cust.joinDate}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewDetails(cust)}
                      className="p-2 hover:bg-tiko-surface-container text-tiko-on-surface-variant hover:text-tiko-primary rounded-xl transition-all inline-flex items-center gap-1.5"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

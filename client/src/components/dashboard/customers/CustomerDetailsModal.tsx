import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { type Customer } from './CustomersTable';
import type { CustomerOrderSummary } from '../../../types';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  orderHistory?: CustomerOrderSummary[];
  onStatusChange?: (id: string, status: 'ACTIVE' | 'INACTIVE') => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  orderHistory,
  onStatusChange,
}) => {
  if (!isOpen || !customer) return null;

  const orders = orderHistory ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in font-dm-sans">
      <div className="bg-white rounded-tiko-md border border-tiko-outline-variant shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-tiko-surface-container-high flex justify-between items-center bg-tiko-surface rounded-t-tiko-md">
          <div>
            <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Customer Insight</h3>
            <p className="text-xs text-tiko-on-surface-variant">From GET /api/customers/:id</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-tiko-surface-container rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-tiko-surface rounded-xl border">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold ${customer.avatarColor}`}>
              {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="font-outfit font-bold text-lg">{customer.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} capitalize`}>
                  {customer.status}
                </span>
                <select
                  value={customer.status.toUpperCase()}
                  onChange={(e) => onStatusChange?.(customer.id, e.target.value as 'ACTIVE' | 'INACTIVE')}
                  className="text-xs bg-white border border-tiko-outline-variant rounded px-2 py-0.5 font-medium text-tiko-on-surface focus:outline-none focus:ring-1 focus:ring-tiko-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-tiko-surface-container-low rounded-xl">
              <ShoppingBag className="w-4 h-4 text-tiko-primary mb-1" />
              <p className="text-xs text-tiko-on-surface-variant">Orders</p>
              <p className="font-bold">{customer.ordersCount}</p>
            </div>
            <div className="p-3 bg-tiko-surface-container-low rounded-xl">
              <DollarSign className="w-4 h-4 text-tiko-primary mb-1" />
              <p className="text-xs text-tiko-on-surface-variant">Total spent</p>
              <p className="font-bold">{customer.totalSpent.toFixed(2)} EGP</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{customer.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{customer.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{customer.address}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Joined {customer.joinDate}</div>
          </div>

          <div>
            <h5 className="font-outfit font-bold mb-3">Recent Orders</h5>
            {orders.length === 0 ? (
              <p className="text-sm text-tiko-on-surface-variant">No orders yet.</p>
            ) : (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li key={o.id} className="p-3 border rounded-xl text-sm flex justify-between">
                    <span className="font-medium">{o.orderNumber}</span>
                    <span>{o.total.toFixed(2)} EGP — {o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

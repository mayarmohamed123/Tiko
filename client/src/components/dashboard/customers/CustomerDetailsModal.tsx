import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { type Customer } from './CustomersTable';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!isOpen || !customer) return null;

  // Let's generate 3 simulated recent orders to make it look super authentic!
  const mockOrders = [
    { id: 'tiko-order-883', date: 'May 12, 2026', total: (customer.totalSpent * 0.4).toFixed(2), items: 'Clay Teapot, Linen Napkins', status: 'Delivered' },
    { id: 'tiko-order-812', date: 'Apr 28, 2026', total: (customer.totalSpent * 0.35).toFixed(2), items: 'Walnut Serving Bowl', status: 'Delivered' },
    { id: 'tiko-order-774', date: 'Mar 15, 2026', total: (customer.totalSpent * 0.25).toFixed(2), items: 'Botanical Soak, Santal Candle', status: 'Delivered' },
  ].slice(0, customer.ordersCount > 0 ? (customer.ordersCount > 3 ? 3 : customer.ordersCount) : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in font-dm-sans">
      <div className="bg-white rounded-tiko-md border border-tiko-outline-variant shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-tiko-surface-container-high flex justify-between items-center bg-tiko-surface rounded-t-tiko-md">
          <div>
            <h3 className="text-lg font-outfit font-bold text-tiko-on-surface">Customer Insight</h3>
            <p className="text-xs text-tiko-on-surface-variant">Detailed customer account profile and order registry.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-tiko-surface-container rounded-full text-tiko-on-surface-variant transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and basic info banner */}
          <div className="flex items-center gap-4 p-4 bg-tiko-surface rounded-xl border border-tiko-surface-container-high">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border border-tiko-outline-variant ${customer.avatarColor} text-tiko-on-surface`}>
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-base font-bold text-tiko-on-surface">{customer.name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-tiko-surface-container-highest text-tiko-on-surface-variant'
              }`}>
                {customer.status === 'active' ? 'Active Account' : 'Inactive Account'}
              </span>
            </div>
          </div>

          {/* Customer stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-tiko-surface-container-low border border-tiko-surface-container p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-tiko-primary/10 rounded-lg text-tiko-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">Total Purchases</p>
                <p className="text-base font-bold text-tiko-on-surface">{customer.ordersCount} Orders</p>
              </div>
            </div>
            
            <div className="bg-tiko-surface-container-low border border-tiko-surface-container p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-tiko-primary/10 rounded-lg text-tiko-primary">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">Total Invested</p>
                <p className="text-base font-bold text-tiko-on-surface">${customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Details / Contact Block */}
          <div className="space-y-3.5 border-t border-tiko-surface-container-high pt-4">
            <h5 className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Contact & Address Details</h5>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-tiko-on-surface">
                <Mail className="w-4 h-4 text-tiko-primary shrink-0 mt-0.5" />
                <span className="break-all">{customer.email}</span>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-tiko-on-surface">
                <Phone className="w-4 h-4 text-tiko-primary shrink-0 mt-0.5" />
                <span>{customer.phone}</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-tiko-on-surface">
                <MapPin className="w-4 h-4 text-tiko-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{customer.address}</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-tiko-on-surface-variant">
                <Calendar className="w-4 h-4 text-tiko-primary shrink-0 mt-0.5" />
                <span>Customer joined on: <span className="font-bold text-tiko-on-surface">{customer.joinDate}</span></span>
              </div>
            </div>
          </div>

          {/* Purchases History List */}
          <div className="space-y-3 border-t border-tiko-surface-container-high pt-4">
            <h5 className="text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Recent Order Registry</h5>
            
            {mockOrders.length === 0 ? (
              <p className="text-xs text-tiko-on-surface-variant/75 italic">No registered order history available for this account.</p>
            ) : (
              <div className="space-y-3">
                {mockOrders.map((ord, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-tiko-surface rounded-xl border border-tiko-surface-container-high hover:border-tiko-outline-variant/60 transition-all">
                    <div>
                      <p className="text-xs font-bold text-tiko-on-surface">{ord.id}</p>
                      <p className="text-[10px] text-tiko-on-surface-variant mt-0.5">{ord.items}</p>
                      <p className="text-[10px] text-tiko-on-surface-variant/65 mt-0.5">{ord.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-tiko-primary">${ord.total}</p>
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-tiko-surface-container-high bg-tiko-surface rounded-b-tiko-md flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-tiko-primary hover:bg-tiko-primary-container text-white rounded-full text-xs font-bold shadow-md shadow-tiko-primary/10 transition-all active:scale-[0.98]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
export default CustomerDetailsModal;

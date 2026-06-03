import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderService } from '../../services';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { OrderStatus, PaymentStatus } from '../../types';

interface OrderDetailModalProps {
  orderId: string; // the UUID id, not orderNumber
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING:    'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-orange-100 text-orange-700',
  SHIPPED:    'bg-blue-100 text-blue-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-gray-200 text-gray-600',
};

const paymentColors: Record<string, string> = {
  PENDING:    'bg-amber-100 text-amber-700',
  AUTHORIZED: 'bg-blue-100 text-blue-700',
  PAID:       'bg-green-100 text-green-700',
  FAILED:     'bg-red-100 text-red-700',
  REFUNDED:   'bg-purple-100 text-purple-700',
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, onClose }) => {
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) =>
      orderService.updateStatus(orderId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
      toast.success('Order status updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update order status'));
    },
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  const updatePaymentStatusMutation = useMutation({
    mutationFn: (newStatus: PaymentStatus) =>
      orderService.updatePayment(orderId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
      toast.success('Payment status updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update payment status'));
    },
  });

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    updatePaymentStatusMutation.mutate(newStatus);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const payment = (order as any)?.payment;
  const customer = (order as any)?.customer;
  const items    = (order as any)?.items ?? [];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-outfit font-bold text-xl text-gray-900">
              Order Details
            </h2>
            {order && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                #{(order as any).orderNumber}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin h-8 w-8 text-tiko-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center py-8">Failed to load order details.</p>
          )}

          {order && (
            <>
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                  <select
                    value={(order as any).status}
                    onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                    disabled={updateStatusMutation.isPending}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-transparent focus:ring-2 focus:ring-tiko-primary cursor-pointer transition-all ${statusColors[(order as any).status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {((order as any).status === 'PENDING') && (
                      <option value="PENDING" className="bg-white text-gray-700 font-bold">PENDING</option>
                    )}
                    <option value="PROCESSING" className="bg-white text-gray-700 font-bold">PROCESSING</option>
                    <option value="SHIPPED" className="bg-white text-gray-700 font-bold">SHIPPED</option>
                    <option value="DELIVERED" className="bg-white text-gray-700 font-bold">DELIVERED</option>
                    <option value="CANCELLED" className="bg-white text-gray-700 font-bold">CANCELLED</option>
                  </select>
                </div>
                {payment && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Payment:</span>
                    <select
                      value={payment.status}
                      onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
                      disabled={updatePaymentStatusMutation.isPending}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-transparent focus:ring-2 focus:ring-tiko-primary cursor-pointer transition-all ${paymentColors[payment.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      <option value="PENDING" className="bg-white text-gray-700 font-bold">PENDING</option>
                      {payment.status === 'AUTHORIZED' && (
                        <option value="AUTHORIZED" className="bg-white text-gray-700 font-bold">AUTHORIZED</option>
                      )}
                      <option value="PAID" className="bg-white text-gray-700 font-bold">PAID</option>
                      <option value="FAILED" className="bg-white text-gray-700 font-bold">FAILED</option>
                      {payment.status === 'REFUNDED' && (
                        <option value="REFUNDED" className="bg-white text-gray-700 font-bold">REFUNDED</option>
                      )}
                    </select>
                  </div>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date((order as any).placedAt).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-bold text-gray-900">{customer?.fullName ?? (order as any).shippingFullName}</p>
                  {customer?.email && <p className="text-xs text-gray-500">{customer.email}</p>}
                  <p className="text-xs text-gray-500">{(order as any).shippingPhone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shipping Address</p>
                  <p className="text-sm text-gray-700">{(order as any).shippingStreet}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white">
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.productName}</p>
                        {item.productMaterial && (
                          <p className="text-xs text-gray-400">{item.productMaterial}</p>
                        )}
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-tiko-primary font-bold mt-0.5">
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && ' | '}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900">
                          {(item.lineTotal / 100).toFixed(2)} EGP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{((order as any).subtotal / 100).toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>{((order as any).deliveryFee / 100).toFixed(2)} EGP</span>
                </div>
                {(order as any).taxAmount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span>{((order as any).taxAmount / 100).toFixed(2)} EGP</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-tiko-primary">{((order as any).totalAmount / 100).toFixed(2)} EGP</span>
                </div>
              </div>

              {/* Payment Info */}
              {payment && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-bold text-gray-900">{payment.method}</span>
                    </div>
                    {payment.instapayReference && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference / Sender</span>
                        <span className="font-bold text-gray-900">{payment.instapayReference}</span>
                      </div>
                    )}
                    {payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Paid At</span>
                        <span className="font-bold text-gray-900">
                          {new Date(payment.paidAt).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Transaction Screenshot ── */}
                  {payment.transactionImageUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Transaction Screenshot
                        </p>
                        <a
                          href={payment.transactionImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-tiko-primary hover:underline flex items-center gap-1"
                        >
                          Open full size
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={payment.transactionImageUrl}
                          alt="InstaPay transaction screenshot"
                          className="w-full max-h-80 object-contain bg-gray-50"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600 shrink-0">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <p className="text-xs text-green-700 font-bold">Payment screenshot submitted by customer</p>
                      </div>
                    </div>
                  ) : payment.method === 'INSTAPAY' ? (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-600 shrink-0">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <p className="text-xs text-amber-700 font-bold">No transaction screenshot uploaded yet</p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Notes */}
              {(order as any).notes && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3">{(order as any).notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

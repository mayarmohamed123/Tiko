import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '../components/Navbar';
import { useCart } from '../context/useCart';

// ─── Validation schema ────────────────────────────────────────────────────────
const deliverySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  streetAddress: z.string().min(5, 'Street address is required'),
  deliveryZone: z.string().min(1, 'Please select a delivery zone'),
  paymentMethod: z.enum(['card', 'cod'] as const, { message: 'Select a payment method' }),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ['Delivery', 'Payment', 'Review'];

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {STEPS.map((label, i) => {
      const step = i + 1;
      const done = current > step;
      const active = current === step;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-outfit font-bold border-2 transition-all
                ${done ? 'bg-tiko-primary border-tiko-primary text-white'
                  : active ? 'bg-tiko-primary border-tiko-primary text-white shadow-md shadow-tiko-primary/25'
                  : 'bg-white border-tiko-outline-variant text-tiko-on-surface-variant'}`}
            >
              {done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : step}
            </div>
            <span className={`mt-1.5 text-xs font-outfit font-bold ${active ? 'text-tiko-primary' : 'text-tiko-on-surface-variant'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-[2px] w-16 sm:w-24 mx-1 mb-5 rounded-full transition-all ${done ? 'bg-tiko-primary' : 'bg-tiko-outline-variant'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Order Summary sidebar ────────────────────────────────────────────────────
const OrderSummary: React.FC = () => {
  const { items, subtotal } = useCart();
  const deliveryFee = 3.50;
  const taxes = 0;
  const total = subtotal / 100; // convert EGP to JOD roughly for display

  return (
    <div className="bg-tiko-surface-container-low rounded-2xl p-6 space-y-5 sticky top-24">
      <h3 className="font-outfit font-bold text-lg text-tiko-on-surface">Order Summary</h3>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-tiko-surface-container">
              <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-outfit font-bold text-tiko-on-surface leading-snug">{item.name}</p>
              <p className="text-xs text-tiko-on-surface-variant">Qty: {item.qty}</p>
              <p className="text-sm font-bold text-tiko-primary">{(item.price / 100).toFixed(2)} JOD</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-tiko-outline-variant" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-dm-sans">{(subtotal / 100).toFixed(2)} JOD</span>
        </div>
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Delivery Fee</span>
          <span className="font-dm-sans">{deliveryFee.toFixed(2)} JOD</span>
        </div>
        <div className="flex justify-between text-tiko-on-surface-variant">
          <span>Taxes</span>
          <span className="font-dm-sans">{taxes.toFixed(2)} JOD</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-tiko-on-surface text-base pt-2 border-t border-tiko-outline-variant">
        <span className="font-outfit">Total Amount</span>
        <span className="text-tiko-primary font-outfit">{(total + deliveryFee).toFixed(2)} JOD</span>
      </div>

      {/* Security badge */}
      <div className="flex items-start gap-2 bg-tiko-surface-container rounded-xl p-3">
        <svg className="text-tiko-tertiary shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-xs text-tiko-on-surface-variant leading-snug">
          Secure checkout with Tiko's buyer protection guarantee.
        </p>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const [step] = useState(1);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryZone: '',
      paymentMethod: undefined,
    },
  });

  const selectedPayment = watch('paymentMethod');

  const onSubmit = (data: DeliveryFormData) => {
    console.log('Checkout data:', data);
    // Will connect to backend later
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-tiko-surface font-dm-sans text-tiko-on-surface">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Page title */}
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-tiko-on-surface text-center mb-10">
          Checkout
        </h1>

        {/* Step indicator */}
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Delivery Details card */}
              <div className="bg-white border border-tiko-outline-variant rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="text-tiko-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h2 className="font-outfit font-bold text-xl text-tiko-on-surface">Delivery Details</h2>
                  </div>
                  <span className="text-sm text-tiko-primary font-bold font-cairo">من قلب البلد</span>
                </div>

                {/* Full Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('fullName')}
                      id="fullName"
                      type="text"
                      placeholder="Zaid Al-Mansour"
                      className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-tiko-error">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      id="phone"
                      type="tel"
                      placeholder="+962 7X XXX XXXX"
                      className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-tiko-error">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="streetAddress" className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                    Street Address
                  </label>
                  <input
                    {...register('streetAddress')}
                    id="streetAddress"
                    type="text"
                    placeholder="Rainbow St. Building 42, Apt 4"
                    className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all placeholder:text-tiko-outline-variant"
                  />
                  {errors.streetAddress && <p className="mt-1 text-xs text-tiko-error">{errors.streetAddress.message}</p>}
                </div>

                {/* Delivery Zone + Estimated Arrival */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label htmlFor="deliveryZone" className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-2">
                      Delivery Zone
                    </label>
                    <div className="relative">
                      <select
                        {...register('deliveryZone')}
                        id="deliveryZone"
                        className="w-full appearance-none px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary transition-all bg-white text-tiko-on-surface cursor-pointer"
                      >
                        <option value="">Select zone...</option>
                        <option value="amman-west">Amman – West</option>
                        <option value="amman-east">Amman – East</option>
                        <option value="zarqa">Zarqa</option>
                        <option value="aqaba">Aqaba</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-tiko-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                    {errors.deliveryZone && <p className="mt-1 text-xs text-tiko-error">{errors.deliveryZone.message}</p>}
                  </div>

                  {/* Estimated Arrival */}
                  <div className="bg-tiko-surface-container-low border border-tiko-outline-variant rounded-xl px-4 py-3 flex items-center gap-3 mt-6 sm:mt-0 self-end">
                    <svg className="text-tiko-primary shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>
                      <p className="text-[10px] font-bold text-tiko-on-surface-variant uppercase tracking-wider">Estimated Arrival</p>
                      <p className="text-sm font-bold text-tiko-on-surface">Today, 4:00 PM – 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method card */}
              <div className="bg-white border border-tiko-outline-variant rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="text-tiko-outline" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <h2 className="font-outfit font-bold text-xl text-tiko-on-surface">Payment Method</h2>
                  </div>
                  <svg className="text-tiko-tertiary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Credit / Debit Card */}
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'card')}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all text-left
                      ${selectedPayment === 'card'
                        ? 'border-tiko-primary bg-tiko-primary/5'
                        : 'border-tiko-outline-variant hover:border-tiko-primary/50'}`}
                  >
                    <svg className={selectedPayment === 'card' ? 'text-tiko-primary' : 'text-tiko-outline'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span className={`text-sm font-outfit font-bold ${selectedPayment === 'card' ? 'text-tiko-primary' : 'text-tiko-on-surface-variant'}`}>
                      Credit / Debit Card
                    </span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setValue('paymentMethod', 'cod')}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all text-left
                      ${selectedPayment === 'cod'
                        ? 'border-tiko-primary bg-tiko-primary/5'
                        : 'border-tiko-outline-variant hover:border-tiko-primary/50'}`}
                  >
                    <svg className={selectedPayment === 'cod' ? 'text-tiko-primary' : 'text-tiko-outline'} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <polyline points="9 10 7 14 9 18" />
                      <polyline points="15 10 17 14 15 18" />
                    </svg>
                    <span className={`text-sm font-outfit font-bold ${selectedPayment === 'cod' ? 'text-tiko-primary' : 'text-tiko-on-surface-variant'}`}>
                      Cash on Delivery
                    </span>
                  </button>
                </div>
                {errors.paymentMethod && <p className="text-xs text-tiko-error">{errors.paymentMethod.message}</p>}
              </div>

              {/* Bottom actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-sm text-tiko-on-surface-variant hover:text-tiko-primary transition-colors font-outfit font-bold"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Shopping
                </Link>

                <button
                  type="submit"
                  className="px-10 py-4 bg-tiko-primary text-white font-outfit font-bold text-sm rounded-xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-md shadow-tiko-primary/25 flex items-center gap-2"
                >
                  Continue to Payment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

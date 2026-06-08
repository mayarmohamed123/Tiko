import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-tiko-surface flex flex-col shadow-2xl transition-transform duration-400 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-tiko-outline-variant">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-outfit font-bold text-xl text-tiko-primary">Tiko Bag</h2>
              <p className="text-xs text-tiko-on-surface-variant mt-0.5">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-tiko-on-surface-variant hover:text-tiko-primary transition-colors mt-0.5"
              aria-label="Close cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-16">
              <svg className="text-tiko-outline-variant" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="font-outfit font-bold text-tiko-on-surface-variant text-base">Your bag is empty</p>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-tiko-primary text-white text-sm font-outfit font-bold rounded-full hover:bg-tiko-primary/90 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-tiko-surface-container">
                  <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-outfit font-bold text-sm text-tiko-on-surface leading-snug">{item.name}</p>
                    <span className="text-sm font-bold text-tiko-primary shrink-0">{((item.price * item.qty) / 100).toFixed(2)} EGP</span>
                  </div>

                  <p className="text-xs text-tiko-on-surface-variant mt-0.5">{item.detail}</p>

                  {item.lowStock && (
                    <p className="text-[10px] text-tiko-error font-bold mt-1 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-tiko-error" />
                      Only 2 left at Tiko
                    </p>
                  )}

                  {/* Qty controls */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-3 border border-tiko-outline-variant rounded-full px-3 py-1.5">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="text-tiko-on-surface-variant hover:text-tiko-primary transition-colors w-4 h-4 flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="text-sm font-bold text-tiko-on-surface w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="text-tiko-on-surface-variant hover:text-tiko-primary transition-colors w-4 h-4 flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-tiko-outline hover:text-tiko-error transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer / Totals ── */}
        {items.length > 0 && (
          <div className="border-t border-tiko-outline-variant px-6 pt-5 pb-6 bg-tiko-surface space-y-3">
            <div className="flex justify-between text-sm text-tiko-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-dm-sans">{((subtotal) / 100).toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-sm text-tiko-on-surface-variant">
              <span>Delivery</span>
              <span className="font-dm-sans text-tiko-on-surface-variant italic">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-base font-bold text-tiko-on-surface pt-2 border-t border-tiko-outline-variant">
              <span>Subtotal Total</span>
              <span className="font-outfit text-lg">{((subtotal) / 100).toFixed(2)} EGP</span>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full mt-2 py-4 bg-tiko-primary text-white text-sm font-outfit font-bold text-center rounded-2xl hover:bg-tiko-primary/90 active:scale-[0.98] transition-all shadow-md shadow-tiko-primary/20"
            >
              PROCEED TO CHECKOUT
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <p className="text-[10px] text-center text-tiko-on-surface-variant mt-1">
              Secure checkout powered by Tiko Pay
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

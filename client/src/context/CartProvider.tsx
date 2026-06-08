import React, { useState, useCallback, useEffect } from 'react';
import type { CartItem } from './cartTypes';
import { CartContext } from './CartContextObject';

// ─── LocalStorage key ─────────────────────────────────────────────────────────
const CART_KEY = 'tiko_cart_v1';

// Only persist the minimal fields needed to restore state.
// We deliberately do NOT store any auth tokens, emails, or PII.
type PersistedItem = Pick<CartItem, 'id' | 'productId' | 'name' | 'detail' | 'price' | 'image' | 'qty' | 'lowStock' | 'selectedColor' | 'selectedSize'>;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: PersistedItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Auto-purge any cart that contains fake/non-UUID IDs (e.g. old seed data)
    const allValid = parsed.every((item) => {
      const uuidToCheck = item.productId || item.id;
      return UUID_RE.test(uuidToCheck);
    });
    if (!allValid) {
      localStorage.removeItem(CART_KEY);
      return [];
    }

    return parsed as CartItem[];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    const toSave: PersistedItem[] = items.map(({ id, productId, name, detail, price, image, qty, lowStock, selectedColor, selectedSize }) => ({
      id, productId, name, detail, price, image, qty, lowStock, selectedColor, selectedSize
    }));
    localStorage.setItem(CART_KEY, JSON.stringify(toSave));
  } catch {
    // Quota exceeded or private-browsing restriction — fail silently
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist every time items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const openCart   = useCallback(() => setIsOpen(true),  []);
  const closeCart  = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const compositeId = `${item.productId}_${item.selectedColor || ''}_${item.selectedSize || ''}`;
      const existing = prev.find((i) => i.id === compositeId);
      if (existing) {
        return prev.map((i) => i.id === compositeId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, id: compositeId, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, openCart, closeCart, toggleCart, addItem, removeItem, updateQty, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

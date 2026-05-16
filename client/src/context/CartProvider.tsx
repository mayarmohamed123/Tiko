import React, { useState, useCallback } from 'react';
import type { CartItem } from './cartTypes';
import { CartContext } from './CartContextObject';

// ─── Static seed images ───────────────────────────────────────────────────────
import container from '../assets/Container.webp';
import container1 from '../assets/Container1.webp';
import container2 from '../assets/Container2.webp';

const SEED_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Terra Clay Vessel',
    detail: 'Size: Large / Color: Sand',
    price: 850,
    image: container,
    qty: 1,
    lowStock: true,
  },
  {
    id: 'cart-2',
    name: 'Linen Morning Throw',
    detail: 'Color: Alabaster',
    price: 1200,
    image: container1,
    qty: 1,
  },
  {
    id: 'cart-3',
    name: 'Brass Ritual Set',
    detail: 'Material: Solid Brass',
    price: 450,
    image: container2,
    qty: 1,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(SEED_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
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
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, openCart, closeCart, toggleCart, addItem, removeItem, updateQty, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

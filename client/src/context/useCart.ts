import { useContext } from 'react';
import { CartContext } from './CartContextObject';
import type { CartContextValue } from './cartTypes';

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

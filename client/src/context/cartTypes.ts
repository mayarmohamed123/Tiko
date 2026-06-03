// ─── CartItem type — shared between context and consumers ─────────────────────
export interface CartItem {
  id: string;
  name: string;
  detail: string;
  price: number;
  image: string;
  qty: number;
  lowStock?: boolean;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  totalItems: number;
  subtotal: number;
}

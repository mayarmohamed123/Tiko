import React, { useState } from 'react';
import type { Product } from '../ProductCard';

// Extended product type for shop
export interface ShopProduct extends Product {
  category: string;
  availability: 'available' | 'sold-out' | 'limited';
  availabilityLabel: string;
  description: string;
}

interface ShopProductCardProps {
  product: ShopProduct;
}

const availabilityConfig = {
  available: { label: 'AVAILABLE AT TIKO', bg: 'bg-tiko-tertiary-container/80 text-tiko-tertiary' },
  'sold-out': { label: 'OUT OF STOCK', bg: 'bg-tiko-surface-container-highest/90 text-tiko-on-surface-variant' },
  limited: { label: 'TIKO PICK', bg: 'bg-tiko-primary-container text-white' },
};

const ShopProductCard: React.FC<ShopProductCardProps> = ({ product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const isSoldOut = product.availability === 'sold-out';
  const avConfig = availabilityConfig[product.availability];

  const handleAdd = () => {
    if (isSoldOut) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-tiko-surface-container-low">
        <img
          src={product.image || undefined}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isSoldOut ? 'group-hover:scale-105' : 'opacity-70 grayscale-30'}`}
        />
        {/* Availability badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-outfit font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${avConfig.bg} backdrop-blur-sm`}>
          {avConfig.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-outfit font-bold text-tiko-on-surface leading-snug flex-1">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-tiko-primary font-outfit shrink-0">${product.price}</span>
        </div>

        <p className="text-xs text-tiko-on-surface-variant line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* CTA Button */}
        {isSoldOut ? (
          <button
            disabled
            className="w-full py-2.5 bg-tiko-surface-container rounded-xl text-xs font-outfit font-bold text-tiko-on-surface-variant uppercase tracking-wide cursor-not-allowed"
          >
            SOLD OUT
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 rounded-xl text-xs font-outfit font-bold uppercase tracking-wide transition-all duration-200 active:scale-[0.97]
              ${addedToCart
                ? 'bg-tiko-tertiary-container text-tiko-tertiary'
                : 'bg-tiko-primary text-white hover:bg-tiko-primary/90 shadow-sm shadow-tiko-primary/20'
              }`}
          >
            {addedToCart ? '✓ ADDED TO BAG' : 'ADD TO BAG'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopProductCard;

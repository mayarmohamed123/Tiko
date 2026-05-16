import React from 'react';

export interface Product {
  id: string;
  name: string;
  material: string;
  price: number;
  image: string;
  badge?: 'NEW ARRIVAL' | 'LIMITED' | 'BEST SELLER';
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const badgeColors: Record<string, string> = {
    'NEW ARRIVAL': 'bg-[#5a7a5a] text-white',
    'LIMITED': 'bg-tiko-primary text-white',
    'BEST SELLER': 'bg-tiko-secondary-container text-tiko-on-surface',
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-tiko-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-outfit font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-tiko-on-surface-variant font-dm-sans">{product.material}</p>
        <h3 className="text-sm font-outfit font-bold text-tiko-on-surface mt-0.5 mb-3 leading-snug flex-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-outfit font-bold text-tiko-on-surface">
            ${product.price.toFixed(2)}
          </span>
          <button
            aria-label={`Add ${product.name} to cart`}
            className="w-9 h-9 rounded-full border border-tiko-outline-variant flex items-center justify-center text-tiko-on-surface-variant hover:bg-tiko-primary hover:text-white hover:border-tiko-primary transition-all duration-200 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

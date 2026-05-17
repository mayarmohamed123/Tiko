import React from 'react';

const popularProducts = [
  {
    id: 1,
    name: 'Clay Hand-Poured Candle',
    sold: 42,
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'Linen Throw Pillow',
    sold: 28,
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Artisan Sage Soap',
    sold: 22,
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=150'
  }
];

export const PopularProductsList: React.FC = () => {
  return (
    <div className="bg-tiko-surface p-6 rounded-tiko-xl border border-tiko-surface-container-high shadow-sm flex flex-col">
      <h3 className="text-lg font-outfit font-bold text-tiko-on-surface mb-6">Popular Products</h3>
      <div className="space-y-6 flex-1">
        {popularProducts.map(product => (
          <div key={product.id} className="flex items-center space-x-4">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-tiko-default object-cover" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-tiko-on-surface truncate">{product.name}</h4>
              <p className="text-xs text-tiko-on-surface-variant">{product.sold} Sold</p>
            </div>
            <div className="text-sm font-bold text-tiko-on-surface">
              ${product.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 border border-tiko-outline-variant rounded-full text-sm font-bold text-tiko-on-surface hover:bg-tiko-surface-container-low transition-colors">
        View Inventory
      </button>
    </div>
  );
};

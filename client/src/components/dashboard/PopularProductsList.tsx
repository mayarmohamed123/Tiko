import React from 'react';

const popularProducts = [
  {
    id: 1,
    name: 'Linen Oversized Shirt',
    sold: 42,
    price: 850.00,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'Heavyweight Cotton Tee',
    sold: 28,
    price: 420.00,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Tailored Wool Trousers',
    sold: 22,
    price: 1200.00,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=150'
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

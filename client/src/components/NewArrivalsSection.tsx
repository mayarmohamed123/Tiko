import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { type Product } from './ProductCard';

// Using available images from assets
import container from '../assets/Container.webp';
import container1 from '../assets/Container1.webp';
import container2 from '../assets/Container2.webp';
import container3 from '../assets/Container3.webp';

const newArrivals: Product[] = [
  {
    id: 'na-1',
    name: 'Hand-Thrown Terracotta Vase',
    material: 'Artisanal Ceramic',
    price: 85,
    image: container,
    badge: 'NEW ARRIVAL',
  },
  {
    id: 'na-2',
    name: 'Raw Linen Cushion Set',
    material: 'Stone Washed',
    price: 120,
    image: container1,
  },
  {
    id: 'na-3',
    name: 'Solis Marble Table Lamp',
    material: 'Natural Travertine',
    price: 245,
    image: container2,
    badge: 'LIMITED',
  },
  {
    id: 'na-4',
    name: 'Hand-Carved Walnut Bowl',
    material: 'Ethically Sourced',
    price: 68,
    image: container3,
  },
];

const NewArrivalsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 bg-tiko-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <p className="text-xs font-outfit font-bold text-tiko-primary uppercase tracking-widest">The Latest</p>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-tiko-on-surface">New at Tiko</h2>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-outfit font-bold text-tiko-on-surface uppercase tracking-widest hover:text-tiko-primary transition-colors underline underline-offset-4"
          >
            Shop New
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;

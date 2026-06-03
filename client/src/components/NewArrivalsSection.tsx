import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { productService } from '../services';
import type { ApiProduct } from '../types';

// ─── Shimmer skeleton card ────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-tiko-surface-container-high" />
    <div className="p-4 space-y-2">
      <div className="h-2.5 w-1/3 bg-tiko-surface-container-high rounded-full" />
      <div className="h-3.5 w-3/4 bg-tiko-surface-container-high rounded-full" />
      <div className="h-3.5 w-1/2 bg-tiko-surface-container-high rounded-full" />
      <div className="mt-3 h-9 w-full bg-tiko-surface-container-high rounded-xl" />
    </div>
  </div>
);

// ─── Mapper ───────────────────────────────────────────────────────────────────
const toProductCard = (p: ApiProduct) => ({
  id: p.id,
  name: p.name,
  material: p.material,
  price: p.price,
  image: p.image ?? p.images?.[0]?.url ?? '',
  badge: undefined as 'NEW ARRIVAL' | 'LIMITED' | 'BEST SELLER' | undefined,
});

// ─── Section ──────────────────────────────────────────────────────────────────
const NewArrivalsSection: React.FC = () => {
  const { data: arrivals = [], isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: productService.newArrivals,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  return (
    <section id="new-arrivals" className="py-16 lg:py-20 bg-tiko-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <p className="text-xs font-outfit font-bold text-tiko-primary uppercase tracking-widest">
              The Latest
            </p>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-tiko-on-surface">
              New at Tiko
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-outfit font-bold text-tiko-on-surface uppercase tracking-widest hover:text-tiko-primary transition-colors underline underline-offset-4"
          >
            Shop All
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : arrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={toProductCard(product)}
                />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && arrivals.length === 0 && (
          <p className="text-center text-tiko-on-surface-variant text-sm py-12">
            No products available yet. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection;

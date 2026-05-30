import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services';
import { useCart } from '../context/useCart';
import type { ApiProduct } from '../types';

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
const SkeletonItem: React.FC = () => (
  <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm animate-pulse">
    <div className="w-14 h-14 rounded-xl shrink-0 bg-tiko-surface-container-high" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-2/3 bg-tiko-surface-container-high rounded-full" />
      <div className="h-2.5 w-1/3 bg-tiko-surface-container-high rounded-full" />
    </div>
    <div className="w-9 h-9 rounded-full bg-tiko-surface-container-high shrink-0" />
  </div>
);

// ─── Single bestseller row ────────────────────────────────────────────────────
interface BestSellerItemProps {
  product: ApiProduct;
}

const BestSellerRow: React.FC<BestSellerItemProps> = ({ product }) => {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Math.round(product.price * 100), // cart stores minor units
      image: product.image ?? product.images?.[0]?.url ?? null,
      detail: product.material,
    });
    openCart();
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-tiko-surface-container">
        <img
          src={product.image ?? product.images?.[0]?.url ?? undefined}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-outfit font-bold text-sm text-tiko-on-surface truncate">
          {product.name}
        </p>
        <p className="text-sm text-tiko-on-surface-variant">
          {product.price.toFixed(2)} JOD
        </p>
      </div>

      {/* Add to bag */}
      <button
        onClick={handleAdd}
        aria-label={`Add ${product.name} to bag`}
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-tiko-primary border border-tiko-primary/30 hover:bg-tiko-primary hover:text-white transition-all duration-200 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </button>
    </div>
  );
};

// ─── Feature image (first bestseller's primary image) ────────────────────────
const FeatureImage: React.FC<{ product?: ApiProduct }> = ({ product }) => {
  const src = product?.image ?? product?.images?.[0]?.url ?? undefined;
  return (
    <div className="relative">
      <div className="rounded-3xl overflow-hidden aspect-4/5 max-w-sm mx-auto lg:max-w-none shadow-xl bg-tiko-surface-container-low">
        {src ? (
          <img src={src} alt={product?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-tiko-surface-container-high animate-pulse" />
        )}
      </div>

      {/* Testimonial card */}
      <div className="absolute bottom-6 left-4 right-4 lg:-left-6 lg:right-auto lg:w-80 bg-white rounded-2xl p-5 shadow-lg">
        <p className="text-sm text-tiko-on-surface leading-relaxed italic mb-3">
          "The quality of the pieces I received exceeded my expectations. Tiko has
          brought a sense of peace and beauty to my living room."
        </p>
        <p className="text-xs font-outfit font-bold text-tiko-on-surface-variant uppercase tracking-widest">
          — Sarah K., Amman
        </p>
      </div>
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const BestSellersSection: React.FC = () => {
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: productService.bestSellers,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-16 lg:py-24 bg-tiko-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Text + Bestseller list */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-outfit font-bold text-tiko-primary uppercase tracking-widest">
                Favorites
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-bold text-tiko-on-surface leading-tight">
                Tiko Bestsellers:<br />Our Community's Picks
              </h2>
              <p className="text-sm lg:text-base text-tiko-on-surface-variant leading-relaxed max-w-sm">
                These are the pieces that define the Tiko home. Discover the items
                our neighbors love most, from artisanal textiles to timeless furniture.
              </p>
            </div>

            {/* Bestseller list */}
            <div className="space-y-3">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => <SkeletonItem key={i} />)
                : sellers.map((product) => (
                    <BestSellerRow key={product.id} product={product} />
                  ))}

              {!isLoading && sellers.length === 0 && (
                <p className="text-sm text-tiko-on-surface-variant">
                  No bestsellers yet — be the first to order!
                </p>
              )}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-outfit font-bold text-tiko-primary hover:underline underline-offset-4 transition-colors"
            >
              Shop All Bestsellers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right: Feature image */}
          <FeatureImage product={sellers[0]} />
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;

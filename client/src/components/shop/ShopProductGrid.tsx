import React from 'react';
import ShopProductCard, { type ShopProduct } from './ShopProductCard';

// Sort options
type SortOption = 'latest' | 'price-asc' | 'price-desc' | 'popular';

interface ShopProductGridProps {
  products: ShopProduct[];
  total: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest Arrivals' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  products,
  total,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-tiko-on-surface-variant font-dm-sans">
          Showing <span className="font-bold text-tiko-on-surface">{total}</span> products
        </p>

        {/* Sort select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-bold text-tiko-on-surface uppercase tracking-wider hidden sm:block">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-white border border-tiko-outline-variant rounded-xl pl-3 pr-8 py-2 text-sm text-tiko-on-surface focus:outline-none focus:border-tiko-primary transition-colors cursor-pointer font-dm-sans"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-tiko-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <svg className="text-tiko-outline-variant" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <p className="text-tiko-on-surface-variant font-outfit text-base">No products match your search.</p>
          <p className="text-sm text-tiko-outline">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          {/* Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-tiko-outline-variant flex items-center justify-center text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-full text-sm font-outfit font-bold transition-all
                  ${currentPage === page
                    ? 'bg-tiko-primary text-white shadow-md shadow-tiko-primary/20'
                    : 'border border-tiko-outline-variant text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary'
                  }`}
              >
                {page}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="text-tiko-outline-variant px-1 font-bold">…</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-9 h-9 rounded-full border border-tiko-outline-variant text-sm font-outfit font-bold text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-tiko-outline-variant flex items-center justify-center text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProductGrid;

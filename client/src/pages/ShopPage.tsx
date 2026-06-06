import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, AlertCircle, RefreshCw } from 'lucide-react';
import ShopSearchBar from '../components/shop/ShopSearchBar';
import ShopFilters, { type ShopFiltersState } from '../components/shop/ShopFilters';
import ShopProductGrid from '../components/shop/ShopProductGrid';
import type { ShopProduct } from '../components/shop/ShopProductCard';
import { productService, categoryService } from '../services';

const PRODUCTS_PER_PAGE = 9;

// ─── Default filter state ─────────────────────────────────────────────────────
const defaultFilters = (): ShopFiltersState => ({
  categories: [],
  availability: [],
  priceMin: 0,
  priceMax: 99999, // effectively "no price cap" — will be overridden dynamically
});

// ─── Shimmer skeleton grid ────────────────────────────────────────────────────
const SkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-square bg-tiko-surface-container-high" />
        <div className="p-4 space-y-2.5">
          <div className="h-2.5 w-1/3 bg-tiko-surface-container-high rounded-full" />
          <div className="h-3.5 w-3/4 bg-tiko-surface-container-high rounded-full" />
          <div className="h-3 w-1/2 bg-tiko-surface-container-high rounded-full" />
          <div className="mt-3 h-10 w-full bg-tiko-surface-container-high rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Error state ─────────────────────────────────────────────────────────────
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <div>
      <p className="font-outfit font-bold text-tiko-on-surface text-lg mb-1">
        Couldn't load products
      </p>
      <p className="text-sm text-tiko-on-surface-variant max-w-xs">
        There was a problem connecting to the server. Please check your connection and try again.
      </p>
    </div>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-6 py-3 bg-tiko-primary text-white text-sm font-bold rounded-full hover:bg-tiko-primary/90 active:scale-95 transition-all"
    >
      <RefreshCw className="w-4 h-4" />
      Retry
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ShopPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShopFiltersState>(defaultFilters());
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const {
    data: dbProducts = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => productService.list(),
    staleTime: 1000 * 60 * 2, // 2 min cache
    retry: 2,
  });

  const {
    data: dbCategories = [],
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: () => categoryService.list(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: bestSellers = [] } = useQuery({
    queryKey: ['shop-best-sellers'],
    queryFn: () => productService.bestSellers(),
    staleTime: 1000 * 60 * 5,
  });

  // A Set of best-seller IDs for O(1) lookup
  const bestSellerIds = useMemo(
    () => new Set(bestSellers.map((p) => p.id)),
    [bestSellers]
  );

  // Dynamic max price — set filter ceiling based on actual product prices
  const maxProductPrice = useMemo(() => {
    if (!dbProducts.length) return 500;
    const prices = dbProducts.map((p) => Number(p.price)).filter((price) => !isNaN(price));
    if (!prices.length) return 500;
    const max = Math.max(...prices);
    // Round up to next 50
    return Math.ceil(max / 50) * 50 || 500;
  }, [dbProducts]);

  const categories = useMemo(() => dbCategories.map((c) => c.name), [dbCategories]);

  // Convert raw API products to shop-adapted format
  const adaptedProducts = useMemo<ShopProduct[]>(() => {
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      material: p.material,
      category: p.category,
      price: p.price,
      image: p.image ?? p.images?.[0]?.url ?? '',
      badge: bestSellerIds.has(p.id) ? 'BEST SELLER' : undefined,
      availability: p.availability,
      availabilityLabel:
        p.availability === 'sold-out'
          ? 'Out of Stock'
          : p.availability === 'limited'
          ? 'Low Stock'
          : 'Available Now',
      description: p.description,
    }));
  }, [dbProducts, bestSellerIds]);

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...adaptedProducts];

    // Search: name, material, or description
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Category sidebar/pills filter (OR relation for multiple categories)
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    // Availability filter
    if (filters.availability.length > 0) {
      list = list.filter((p) =>
        filters.availability.some((opt) => {
          if (opt === 'Available Now') return p.availability !== 'sold-out';
          if (opt === 'Tiko Picks') return bestSellerIds.has(p.id);
          return true;
        })
      );
    }

    // Price filter — only apply if user has explicitly changed the max from unlimited
    if (filters.priceMax < 99999) {
      list = list.filter((p) => p.price <= filters.priceMax);
    }

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'popular') {
      list.sort((a, b) =>
        (bestSellerIds.has(b.id) ? 1 : 0) - (bestSellerIds.has(a.id) ? 1 : 0)
      );
    }

    return list;
  }, [search, filters, sortBy, adaptedProducts, bestSellerIds]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFiltersChange = (f: ShopFiltersState) => {
    setFilters(f);
    setCurrentPage(1);
  };

  // Scroll to top on page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = isProductsLoading || isCategoriesLoading;
  const activeFilterCount =
    filters.categories.length +
    filters.availability.length +
    (filters.priceMax < 99999 ? 1 : 0);

  return (
    <>
      {/* ── Search Bar ── */}
      <ShopSearchBar
        value={search}
        onChange={handleSearchChange}
        categories={categories}
        selectedCategories={filters.categories}
        onCategoryToggle={(cat) => {
          const next = filters.categories.includes(cat)
            ? filters.categories.filter((c) => c !== cat)
            : [...filters.categories, cat];
          handleFiltersChange({ ...filters, categories: next });
        }}
        onClearCategories={() => {
          handleFiltersChange({ ...filters, categories: [] });
        }}
      />

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* Mobile filter button */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-tiko-outline-variant rounded-xl text-sm font-outfit font-bold text-tiko-on-surface hover:border-tiko-primary hover:text-tiko-primary transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-tiko-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8 lg:gap-10">

          {/* ── Desktop Filters Sidebar ── */}
          <aside className="hidden lg:block shrink-0 w-52 sticky top-24 self-start">
            <ShopFilters
              filters={filters}
              onChange={handleFiltersChange}
              categories={categories}
              maxPrice={maxProductPrice}
            />
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {isProductsError ? (
              <ErrorState onRetry={() => refetchProducts()} />
            ) : isLoading ? (
              <SkeletonGrid />
            ) : (
              <ShopProductGrid
                products={paginated}
                total={filtered.length}
                sortBy={sortBy}
                onSortChange={(s) => {
                  setSortBy(s);
                  setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {filtersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-tiko-outline-variant">
              <h2 className="text-base font-outfit font-bold text-tiko-on-surface flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-tiko-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-tiko-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-tiko-surface-container transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-tiko-on-surface-variant" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <ShopFilters
                filters={filters}
                onChange={(f) => {
                  handleFiltersChange(f);
                }}
                categories={categories}
                maxPrice={maxProductPrice}
              />
            </div>
            <div className="p-5 border-t border-tiko-outline-variant">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-3 bg-tiko-primary text-white font-bold text-sm rounded-xl hover:bg-tiko-primary/90 active:scale-95 transition-all"
              >
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShopPage;

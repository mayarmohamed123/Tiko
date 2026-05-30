import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ShopSearchBar from '../components/shop/ShopSearchBar';
import ShopFilters, { type ShopFiltersState } from '../components/shop/ShopFilters';
import ShopProductGrid from '../components/shop/ShopProductGrid';
import type { ShopProduct } from '../components/shop/ShopProductCard';
import { productService, categoryService } from '../services';

const PRODUCTS_PER_PAGE = 9;

// ─── Shimmer skeleton grid for loading state ──────────────────────────────────
const SkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-square bg-tiko-surface-container-high" />
        <div className="p-4 space-y-2">
          <div className="h-2.5 w-1/3 bg-tiko-surface-container-high rounded-full" />
          <div className="h-3.5 w-3/4 bg-tiko-surface-container-high rounded-full" />
          <div className="h-3.5 w-1/2 bg-tiko-surface-container-high rounded-full" />
          <div className="mt-3 h-9 w-full bg-tiko-surface-container-high rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

const ShopPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShopFiltersState>({
    categories: [],
    availability: [],
    priceMin: 0,
    priceMax: 500,
  });
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile toggle

  // ── Fetch products and categories ──────────────────────────────────────────
  const { data: dbProducts = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => productService.list(),
  });

  const { data: dbCategories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: () => categoryService.list(),
  });

  // Extract category names for dynamic filters and search quick links
  const categories = useMemo(() => {
    return dbCategories.map((c) => c.name);
  }, [dbCategories]);

  // Convert raw API products to shop-adapted products
  const adaptedProducts = useMemo<ShopProduct[]>(() => {
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      material: p.material,
      category: p.category,
      price: p.price,
      image: p.image ?? p.images?.[0]?.url ?? '',
      badge: p.availability === 'limited' ? 'LIMITED' : undefined,
      availability: p.availability,
      availabilityLabel:
        p.availability === 'sold-out'
          ? 'Out of Stock'
          : p.availability === 'limited'
          ? 'Tiko Pick'
          : 'Available Now',
      description: p.description,
    }));
  }, [dbProducts]);

  // ── Filter & sort logic ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...adaptedProducts];

    // Search input (excluding exact category hits)
    if (search && !categories.includes(search)) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Category pill quick select from search bar
    if (search && categories.includes(search)) {
      list = list.filter((p) => p.category === search);
    }

    // Category sidebar filter
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    // Availability filter
    // "Available Now" -> available
    // "Tiko Picks" -> limited
    // "Ships Locally" -> not sold-out (i.e. available & limited)
    if (filters.availability.length > 0) {
      list = list.filter((p) => {
        return filters.availability.some((opt) => {
          if (opt === 'Available Now') return p.availability === 'available';
          if (opt === 'Tiko Picks') return p.availability === 'limited';
          if (opt === 'Ships Locally') return p.availability !== 'sold-out';
          return true;
        });
      });
    }

    // Price filter
    list = list.filter((p) => p.price <= filters.priceMax);

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'latest') {
      // Default / latest arrivals. (In real-world, we'd preserve fetched DB order or sort by date,
      // which productService list endpoint returns already pre-sorted by createdAt desc!)
    }

    return list;
  }, [search, filters, sortBy, adaptedProducts, categories]);

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

  const isLoading = isProductsLoading || isCategoriesLoading;

  return (
    <>
      {/* ── Search Bar ── */}
      <ShopSearchBar value={search} onChange={handleSearchChange} categories={categories} />

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-5 py-2.5 border border-tiko-outline-variant rounded-xl text-sm font-outfit font-bold text-tiko-on-surface hover:border-tiko-primary hover:text-tiko-primary transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex gap-10">
          {/* ── Filters Sidebar ── */}
          <div className={`shrink-0 w-52 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <ShopFilters
              filters={filters}
              onChange={handleFiltersChange}
              categories={categories}
            />
          </div>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
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
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;

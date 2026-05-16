import React, { useState, useMemo } from 'react';
import MainLayout from '../components/MainLayout';
import ShopSearchBar from '../components/shop/ShopSearchBar';
import ShopFilters, { type ShopFiltersState } from '../components/shop/ShopFilters';
import ShopProductGrid from '../components/shop/ShopProductGrid';
import type { ShopProduct } from '../components/shop/ShopProductCard';

// ─── Static product data (swap with API later) ───────────────────────────────
import container from '../assets/Container.webp';
import container1 from '../assets/Container1.webp';
import container2 from '../assets/Container2.webp';
import container3 from '../assets/Container3.webp';
import interiorDesign from '../assets/Interior Design.webp';
import backgroundImg from '../assets/Background.webp';

const ALL_PRODUCTS: ShopProduct[] = [
  {
    id: 'p-1',
    name: 'Clay Studio Teapot',
    material: 'Artisanal Ceramic',
    category: 'Kitchen & Dining',
    price: 85,
    image: container,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Hand-thrown stoneware with a unique matte glaze and a balanced pour spout.',
  },
  {
    id: 'p-2',
    name: 'Linen Napkin Set',
    material: 'Stone Washed',
    category: 'Textiles',
    price: 42,
    image: container1,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Set of four pre-washed Belgian linen napkins in our signature stone colour.',
  },
  {
    id: 'p-3',
    name: 'Walnut Serving Bowl',
    material: 'Sustainable Walnut',
    category: 'Kitchen & Dining',
    price: 120,
    image: container3,
    availability: 'sold-out',
    availabilityLabel: 'Out of Stock',
    description: 'Each bowl is carved from a single piece of sustainable American walnut.',
  },
  {
    id: 'p-4',
    name: 'Botanical Soak',
    material: 'Organic Botanicals',
    category: 'Wellness',
    price: 34,
    image: container2,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Mineral-rich salts infused with organic lavender and chamomile for deep relaxation.',
  },
  {
    id: 'p-5',
    name: 'Santal Candle',
    material: 'Coconut Wax',
    category: 'Home Decor',
    price: 58,
    image: backgroundImg,
    availability: 'limited',
    availabilityLabel: 'Tiko Pick',
    description: 'A warm, woody blend of sandalwood and papyrus in a concrete vessel.',
  },
  {
    id: 'p-6',
    name: 'Woven Cotton Throw',
    material: 'Ethiopian Cotton',
    category: 'Textiles',
    price: 95,
    image: container1,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Ethically woven by artisan cooperatives in a classic herringbone weave.',
  },
  {
    id: 'p-7',
    name: 'Solis Marble Lamp',
    material: 'Natural Travertine',
    category: 'Lighting',
    price: 245,
    image: container2,
    badge: 'LIMITED',
    availability: 'limited',
    availabilityLabel: 'Tiko Pick',
    description: 'A sculptural table lamp carved from natural travertine with a linen shade.',
  },
  {
    id: 'p-8',
    name: 'Terracotta Vase Set',
    material: 'Artisanal Ceramic',
    category: 'Home Decor',
    price: 68,
    image: container,
    badge: 'NEW ARRIVAL',
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'A set of two hand-thrown terracotta vases in complementary heights.',
  },
  {
    id: 'p-9',
    name: 'Olive Tree Planter',
    material: 'Spun Concrete',
    category: 'Home Decor',
    price: 155,
    image: interiorDesign,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Minimalist spun-concrete planter, perfect for olive trees and indoor plants.',
  },
  {
    id: 'p-10',
    name: 'Walnut Carved Bowl',
    material: 'Ethically Sourced',
    category: 'Kitchen & Dining',
    price: 68,
    image: container3,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Hand-carved from a single block of sustainably harvested walnut wood.',
  },
  {
    id: 'p-11',
    name: 'Bridge Bookends',
    material: 'Powder-Coated Steel',
    category: 'Home Decor',
    price: 65,
    image: container2,
    availability: 'available',
    availabilityLabel: 'Available at Tiko',
    description: 'Powder-coated steel bookends with a sculptural arch silhouette.',
  },
  {
    id: 'p-12',
    name: 'Sandstone Candle',
    material: 'Soy + Beeswax Blend',
    category: 'Wellness',
    price: 42,
    image: backgroundImg,
    availability: 'limited',
    availabilityLabel: 'Tiko Pick',
    description: 'A clean-burning blend with notes of amber, cedarwood, and warm spice.',
  },
];

const PRODUCTS_PER_PAGE = 9;

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

  // ── Filter & sort logic ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    // Search
    if (search && !['Home Decor', 'Kitchen & Dining', 'Textiles', 'Wellness', 'Lighting'].includes(search)) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category pill search
    if (['Home Decor', 'Kitchen & Dining', 'Textiles', 'Wellness', 'Lighting'].includes(search)) {
      list = list.filter((p) => p.category === search);
    }

    // Category filter
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    // Availability filter
    if (filters.availability.includes('Available Now')) {
      list = list.filter((p) => p.availability !== 'sold-out');
    }
    if (filters.availability.includes('Tiko Picks')) {
      list = list.filter((p) => p.availability === 'limited');
    }

    // Price filter
    list = list.filter((p) => p.price <= filters.priceMax);

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [search, filters, sortBy]);

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

  return (
    <MainLayout>
      {/* ── Search Bar ── */}
      <ShopSearchBar value={search} onChange={handleSearchChange} />

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
            <ShopFilters filters={filters} onChange={handleFiltersChange} />
          </div>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            <ShopProductGrid
              products={paginated}
              total={filtered.length}
              sortBy={sortBy}
              onSortChange={(s) => { setSortBy(s); setCurrentPage(1); }}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;

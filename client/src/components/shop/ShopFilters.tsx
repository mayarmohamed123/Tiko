import React from 'react';

export interface ShopFiltersState {
  categories: string[];
  availability: string[];
  priceMin: number;
  priceMax: number;
}

interface ShopFiltersProps {
  filters: ShopFiltersState;
  onChange: (filters: ShopFiltersState) => void;
  categories: string[];
  maxPrice?: number; // dynamic ceiling based on actual product prices
}

const AVAILABILITY = ['Available Now', 'Tiko Picks'];

const ShopFilters: React.FC<ShopFiltersProps> = ({
  filters,
  onChange,
  categories,
  maxPrice = 500,
}) => {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleAvailability = (opt: string) => {
    const next = filters.availability.includes(opt)
      ? filters.availability.filter((a) => a !== opt)
      : [...filters.availability, opt];
    onChange({ ...filters, availability: next });
  };

  const clearAll = () => {
    onChange({ categories: [], availability: [], priceMin: 0, priceMax: 99999 });
  };

  const hasActive =
    filters.categories.length > 0 ||
    filters.availability.length > 0 ||
    filters.priceMax < 99999;

  // Price display — cap label
  const priceLabel =
    filters.priceMax >= maxPrice
      ? `${maxPrice} EGP+`
      : `${filters.priceMax} EGP`;

  return (
    <aside className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-outfit font-bold text-tiko-on-surface uppercase tracking-widest">
          Filters
        </h2>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-xs text-tiko-primary underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-tiko-outline uppercase tracking-widest mb-3">
            Categories
          </p>
          <ul className="space-y-2.5">
            {categories.map((cat) => {
              const active = filters.categories.includes(cat);
              return (
                <li key={cat}>
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-3 w-full group text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150
                        ${active
                          ? 'bg-tiko-primary border-tiko-primary'
                          : 'border-tiko-outline-variant group-hover:border-tiko-primary'
                        }`}
                    >
                      {active && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors leading-tight
                        ${active
                          ? 'text-tiko-primary font-bold'
                          : 'text-tiko-on-surface-variant group-hover:text-tiko-primary'
                        }`}
                    >
                      {cat}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {categories.length > 0 && <hr className="border-tiko-outline-variant" />}

      {/* Availability */}
      <div>
        <p className="text-[10px] font-bold text-tiko-outline uppercase tracking-widest mb-3">
          Availability
        </p>
        <ul className="space-y-2.5">
          {AVAILABILITY.map((opt) => {
            const active = filters.availability.includes(opt);
            return (
              <li key={opt}>
                <button
                  onClick={() => toggleAvailability(opt)}
                  className="flex items-center gap-3 w-full group text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150
                      ${active
                        ? 'bg-tiko-primary border-tiko-primary'
                        : 'border-tiko-outline-variant group-hover:border-tiko-primary'
                      }`}
                  >
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm transition-colors leading-tight
                      ${active
                        ? 'text-tiko-primary font-bold'
                        : 'text-tiko-on-surface-variant group-hover:text-tiko-primary'
                      }`}
                  >
                    {opt}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <hr className="border-tiko-outline-variant" />

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-tiko-outline uppercase tracking-widest">
            Max Price
          </p>
          <span className="text-xs font-bold text-tiko-primary">{priceLabel}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={Math.max(1, Math.floor(maxPrice / 20))}
          value={filters.priceMax >= 99999 ? maxPrice : filters.priceMax}
          onChange={(e) =>
            onChange({ ...filters, priceMax: Number(e.target.value) })
          }
          className="w-full accent-tiko-primary h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-tiko-on-surface-variant font-dm-sans">0 EGP</span>
          <span className="text-xs text-tiko-on-surface-variant font-dm-sans">
            {maxPrice} EGP
          </span>
        </div>
      </div>
    </aside>
  );
};

export default ShopFilters;

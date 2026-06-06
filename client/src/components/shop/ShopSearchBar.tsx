import React from 'react';

interface ShopSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (cat: string) => void;
  onClearCategories: () => void;
}

const ShopSearchBar: React.FC<ShopSearchBarProps> = ({
  value,
  onChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearCategories,
}) => {
  return (
    <div className="w-full bg-tiko-surface border-b border-tiko-outline-variant py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative max-w-2xl mx-auto">
          {/* Search icon */}
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-tiko-outline pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>

          <input
            id="shop-search"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search our collection..."
            className="
              w-full pl-14 pr-6 py-4
              bg-white border border-tiko-outline-variant rounded-2xl
              text-tiko-on-surface placeholder:text-tiko-outline-variant
              font-dm-sans text-base
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary
              transition-all duration-200
            "
          />

          {/* Clear button */}
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-tiko-outline hover:text-tiko-primary transition-colors"
              aria-label="Clear search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {['All', ...categories].map((tag) => {
            const isAll = tag === 'All';
            const isActive = isAll
              ? selectedCategories.length === 0 && !value
              : selectedCategories.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  if (isAll) {
                    onChange('');
                    onClearCategories();
                  } else {
                    onCategoryToggle(tag);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-outfit font-bold uppercase tracking-wide border transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-tiko-primary text-white border-tiko-primary shadow-sm'
                    : 'bg-white text-tiko-on-surface-variant border-tiko-outline-variant hover:border-tiko-primary hover:text-tiko-primary'
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopSearchBar;

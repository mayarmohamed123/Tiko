import React from 'react';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
      {/* Search */}
      <div className="relative w-full sm:w-80">
        <input 
          type="text" 
          placeholder="Search product or material..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-tiko-outline-variant bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/25 focus:border-tiko-primary placeholder:text-tiko-on-surface-variant/50"
        />
        <Search className="w-4 h-4 text-tiko-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Filter Pill List */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        <span className="text-xs font-bold uppercase text-tiko-on-surface-variant/80 tracking-wider mr-2 hidden md:inline">Category:</span>
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedCategory === 'All'
              ? 'bg-tiko-primary text-white shadow-sm shadow-tiko-primary/15'
              : 'bg-tiko-surface-container text-tiko-on-surface hover:bg-tiko-surface-container-high'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-tiko-primary text-white shadow-sm shadow-tiko-primary/15'
                : 'bg-tiko-surface-container text-tiko-on-surface hover:bg-tiko-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

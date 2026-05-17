import React from 'react';
import { Search } from 'lucide-react';

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm font-dm-sans">
      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-tiko-outline-variant bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/25 focus:border-tiko-primary placeholder:text-tiko-on-surface-variant/50"
        />
        <Search className="w-4 h-4 text-tiko-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 w-full sm:w-auto">
        {['All', 'Active', 'Inactive'].map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === status
                ? 'bg-tiko-primary text-white shadow-sm shadow-tiko-primary/15'
                : 'bg-tiko-surface-container text-tiko-on-surface hover:bg-tiko-surface-container-high'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

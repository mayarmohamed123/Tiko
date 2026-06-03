import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { PopularProduct } from '../../services/analyticsService';

interface PopularProductsProps {
  data: PopularProduct[];
  isLoading: boolean;
}

export const PopularProducts: React.FC<PopularProductsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-tiko-surface-container rounded-lg" />
            <div className="flex-1 h-4 bg-tiko-surface-container rounded" />
            <div className="w-16 h-4 bg-tiko-surface-container rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-tiko-on-surface-variant gap-2">
        <TrendingUp className="w-8 h-8 opacity-30" />
        <p className="text-sm">No product sales data yet</p>
      </div>
    );
  }

  const maxQty = data[0]?.quantitySold ?? 1;

  return (
    <div className="space-y-3">
      {data.map((product, index) => (
        <div key={product.id} className="flex items-center gap-3 group">
          <span className="text-xs font-bold text-tiko-on-surface-variant w-5 text-right shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-tiko-on-surface truncate pr-2">{product.name}</p>
              <span className="text-xs font-bold text-tiko-primary shrink-0">
                {product.quantitySold} sold
              </span>
            </div>
            <div className="h-1.5 bg-tiko-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tiko-primary to-tiko-secondary rounded-full transition-all duration-700"
                style={{ width: `${(product.quantitySold / maxQty) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-tiko-on-surface-variant shrink-0 w-20 text-right">
            {product.revenue.toFixed(0)} EGP
          </span>
        </div>
      ))}
    </div>
  );
};

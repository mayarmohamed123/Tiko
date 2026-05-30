import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services';

interface ProductRecommendationsProps {
  currentProductId?: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ currentProductId }) => {
  const { data: arrivals = [], isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: productService.newArrivals,
  });

  // Filter out the current product to avoid recommending itself
  const recommendations = arrivals
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-tiko-outline-variant pb-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-tiko-primary uppercase tracking-widest animate-pulse">Curated for you</p>
            <div className="h-8 w-48 bg-tiko-surface-container-high rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-square rounded-4xl bg-tiko-surface-container-high" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-tiko-surface-container-high rounded-full" />
                <div className="h-3 w-1/3 bg-tiko-surface-container-high rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between border-b border-tiko-outline-variant pb-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-tiko-primary uppercase tracking-widest">Curated for you</p>
          <h2 className="font-outfit font-bold text-3xl text-tiko-on-surface">You May Also Like</h2>
        </div>
        <Link to="/shop" className="text-xs font-bold text-tiko-on-surface underline underline-offset-4 hover:text-tiko-primary transition-colors">
          View All Recommendations
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {recommendations.map((prod) => {
          const imageSrc = prod.image ?? prod.images?.[0]?.url ?? undefined;
          return (
            <Link 
              key={prod.id} 
              to={`/product/${prod.id}`}
              className="group flex flex-col gap-4"
            >
              <div className="aspect-square rounded-4xl overflow-hidden bg-tiko-surface-container-low shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-tiko-primary/5">
                <img 
                  src={imageSrc} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-outfit font-bold text-base text-tiko-on-surface leading-tight group-hover:text-tiko-primary transition-colors truncate">
                  {prod.name}
                </h3>
                <p className="font-dm-sans font-bold text-sm text-tiko-outline">
                  {prod.price.toFixed(2)} JOD
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductRecommendations;

import React from 'react';
import { Link } from 'react-router-dom';
import interiorImg from '../../assets/Interior Design.webp';
import containerImg from '../../assets/Container.webp';
import container1Img from '../../assets/Container1.webp';
import container2Img from '../../assets/Container2.webp';

const RECOMMENDATIONS = [
  { id: '1', name: 'Canvas Relaxed Trousers', price: 240, currency: 'EGP', image: interiorImg },
  { id: '2', name: 'Market Tote in Espresso', price: 110, currency: 'EGP', image: containerImg },
  { id: '3', name: 'Olive Field Scarf', price: 85, currency: 'EGP', image: container1Img },
  { id: '4', name: 'Essential Cotton Tee', price: 75, currency: 'EGP', image: container2Img },
];

const ProductRecommendations: React.FC = () => {
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
        {RECOMMENDATIONS.map((prod) => (
          <Link 
            key={prod.id} 
            to={`/product/${prod.id}`}
            className="group flex flex-col gap-4"
          >
            <div className="aspect-square rounded-4xl overflow-hidden bg-tiko-surface-container-low shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-tiko-primary/5">
              <img 
                src={prod.image} 
                alt={prod.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-outfit font-bold text-base text-tiko-on-surface leading-tight group-hover:text-tiko-primary transition-colors">
                {prod.name}
              </h3>
              <p className="font-dm-sans font-bold text-sm text-tiko-outline">
                {prod.price.toFixed(2)} {prod.currency}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;

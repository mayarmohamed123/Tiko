import React from 'react';
import interiorDesign from '../assets/Interior Design.webp';
import container from '../assets/Container.webp';
import container2 from '../assets/Container2.webp';

interface BestSellerItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const bestSellers: BestSellerItem[] = [
  { id: 'bs-1', name: 'Woven Cotton Throw', price: 95, image: container },
  { id: 'bs-2', name: 'Sandstone Scented Candle', price: 42, image: container2 },
];

const BestSellersSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-tiko-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Text + List */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-outfit font-bold text-tiko-primary uppercase tracking-widest">Favorites</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-bold text-tiko-on-surface leading-tight">
                Tiko Bestsellers:<br />Our Community's Picks
              </h2>
              <p className="text-sm lg:text-base text-tiko-on-surface-variant leading-relaxed max-w-sm">
                These are the pieces that define the Tiko home. Discover the items our neighbors love most, from artisanal textiles to timeless furniture.
              </p>
            </div>

            {/* Bestseller List */}
            <div className="space-y-3">
              {bestSellers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-tiko-surface-container">
                    <img src={item.image || undefined} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-outfit font-bold text-sm text-tiko-on-surface truncate">{item.name}</p>
                    <p className="text-sm text-tiko-on-surface-variant">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    aria-label={`Add ${item.name} to cart`}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-tiko-primary border border-tiko-primary/30 hover:bg-tiko-primary hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Image + Testimonial */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-4/5 max-w-sm mx-auto lg:max-w-none shadow-xl">
              <img
                src={interiorDesign}
                alt="Tiko bestseller featured product"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Testimonial Card */}
            <div className="absolute bottom-6 left-4 right-4 lg:-left-6 lg:right-auto lg:w-80 bg-white rounded-2xl p-5 shadow-lg">
              <p className="text-sm text-tiko-on-surface leading-relaxed italic mb-3">
                "The quality of the pieces I received exceeded my expectations. Tiko has brought a sense of peace and beauty to my living room."
              </p>
              <p className="text-xs font-outfit font-bold text-tiko-on-surface-variant uppercase tracking-widest">
                — Sarah K., Amman
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;

import React from 'react';
import ProductGallery from '../components/product/ProductGallery';

// ─── Mock Product Data ────────────────────────────────────────────────────────
import shirtMain from '../assets/AB6AXU1.webp';
import shirtThumb1 from '../assets/AB6AXU2.webp';
import shirtThumb2 from '../assets/AB6AXU~1.webp';
import ProductInfo from '../components/product/ProductInfo';
import ProductRecommendations from '../components/product/ProductRecommendations';

const PRODUCT_DATA = {
  id: 'heritage-linen-shirt',
  name: 'The Heritage Linen Shirt',
  price: 185,
  currency: 'EGP',
  inStock: true,
  breadcrumbs: ['Shop All', 'Apparel', 'The Linen Series'],
  colors: [
    { name: 'Tiko Clay', hex: '#8e4d31' },
    { name: 'Sandstone', hex: '#d8c2ba' },
    { name: 'Olive Grove', hex: '#54603f' },
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  images: [shirtMain, shirtThumb1, shirtThumb2],
  details: `Crafted from 100% premium European flax, our Heritage Linen Shirt is a testament to timeless craftsmanship. Features a relaxed fit, natural shell buttons, and a soft, breathable texture that improves with every wash.`,
  composition: [
    '100% European Flax Linen',
    'Natural Shell Buttons',
    'Breathable & Thermoregulating',
    'Ethically sourced materials'
  ],
  shipping: 'Free express shipping on orders over 1500 EGP. Standard delivery takes 3-5 business days.',
  returns: 'Easy 14-day returns and exchanges.'
};

const ProductDetailsPage: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {PRODUCT_DATA.breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${i === PRODUCT_DATA.breadcrumbs.length - 1 ? 'text-tiko-on-surface' : 'text-tiko-outline'}`}>
                {crumb}
              </span>
              {i < PRODUCT_DATA.breadcrumbs.length - 1 && (
                <span className="text-tiko-outline-variant">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Gallery (7 columns) */}
          <div className="lg:col-span-7">
            <ProductGallery images={PRODUCT_DATA.images} />
          </div>

          {/* Right: Info (5 columns) */}
          <div className="lg:col-span-5">
            <ProductInfo product={PRODUCT_DATA} />
          </div>
        </div>

        {/* Bottom: Recommendations */}
        <div className="mt-24">
          <ProductRecommendations />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;

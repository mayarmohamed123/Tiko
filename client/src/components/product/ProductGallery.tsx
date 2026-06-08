import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

// NOTE: The parent (ProductDetailsPage) must pass key={productId} so that this
// component remounts when the user navigates to a different product, naturally
// resetting selectedIndex to 0 without any useEffect.
const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  // Track which index is selected; stays at 0 on fresh mount (via key prop).
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Clamp in case images array shrinks
  const clampedIndex = Math.min(selectedIndex, Math.max(0, images.length - 1));
  const activeImage = images[clampedIndex] ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-tiko-surface-container-low shadow-sm">
        <img
          src={activeImage || undefined}
          alt="Product Detail"
          className="w-full h-full object-contain p-4 transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border-2 bg-tiko-surface-container-low transition-all shrink-0
                ${clampedIndex === i ? 'border-tiko-primary ring-2 ring-tiko-primary/20 shadow-md' : 'border-tiko-outline-variant/30 hover:border-tiko-outline-variant'}`}
            >
              <img src={img || undefined} alt={`Thumb ${i}`} className="w-full h-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

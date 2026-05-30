import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  // Default to null (not undefined/"") so <img src={null}> is safely a no-op
  const [activeImage, setActiveImage] = useState<string | null>(images[0] ?? null);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Large Image */}
      <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden bg-tiko-surface-container-low shadow-sm">
        <img
          src={activeImage || null}
          alt="Product Detail"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={`w-1/3 aspect-square rounded-2xl overflow-hidden border-2 transition-all
              ${activeImage === img ? 'border-tiko-primary ring-2 ring-tiko-primary/20 shadow-lg' : 'border-transparent hover:border-tiko-outline-variant'}`}
          >
            <img src={img || null} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState<string | null>(images[0] ?? null);

  // Sync activeImage with the first image if the images prop updates
  useEffect(() => {
    setActiveImage(images[0] ?? null);
  }, [images]);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Large Image */}
      <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden bg-tiko-surface-container-low shadow-sm">
        <img
          src={activeImage || undefined}
          alt="Product Detail"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`w-1/3 aspect-square rounded-2xl overflow-hidden border-2 transition-all
                ${activeImage === img ? 'border-tiko-primary ring-2 ring-tiko-primary/20 shadow-lg' : 'border-transparent hover:border-tiko-outline-variant'}`}
            >
              <img src={img || undefined} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

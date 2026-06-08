import React, { useState } from 'react';
import { useCart } from '../../context/useCart';
import ProductAccordions from './ProductAccordions';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
  breadcrumbs: string[];
  colors: string[];
  sizes: string[];
  images: string[];
  details: string;
  composition: string[];
  shipping: string;
  returns: string;
  material: string;
}

interface ProductInfoProps {
  product: ProductType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToBag = () => {
    setIsAdding(true);
    const detailsArray: string[] = [];
    if (selectedSize) detailsArray.push(`Size: ${selectedSize}`);
    if (selectedColor) detailsArray.push(`Color: ${selectedColor}`);
    const detailString = detailsArray.join(' / ') || product.material;

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Math.round(product.price * 100), // cart stores price in minor units (cents)
      image: product.images[0] || '',
      detail: detailString,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 800);
  };

  return (
    <div className="flex flex-col gap-8 h-full sticky top-24">
      {/* Title & Price */}
      <div className="space-y-2">
        <h1 className="font-outfit font-bold text-2xl lg:text-3xl text-tiko-on-surface leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-tiko-primary font-outfit">
            {product.price.toFixed(2)} {product.currency}
          </p>
          <div className="flex items-center gap-1.5 bg-tiko-tertiary-container/20 px-3 py-1 rounded-full border border-tiko-tertiary-container/30">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-tiko-tertiary animate-pulse' : 'bg-tiko-outline'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${product.inStock ? 'text-tiko-tertiary' : 'text-tiko-on-surface-variant'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Select Color */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-tiko-outline uppercase tracking-widest">Select Color</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all duration-300 font-outfit text-xs font-bold
                  ${selectedColor === color 
                    ? 'border-tiko-primary bg-tiko-primary text-white shadow-lg shadow-tiko-primary/25' 
                    : 'border-tiko-outline-variant text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Size */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-tiko-outline uppercase tracking-widest">Select Size</p>
            <button className="text-[10px] font-bold text-tiko-primary underline underline-offset-2 hover:opacity-80">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 font-outfit text-sm font-bold
                  ${selectedSize === size 
                    ? 'border-tiko-primary bg-tiko-primary text-white shadow-lg shadow-tiko-primary/25' 
                    : 'border-tiko-outline-variant text-tiko-on-surface-variant hover:border-tiko-primary hover:text-tiko-primary'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Bag Button */}
      <button
        onClick={handleAddToBag}
        disabled={isAdding || !product.inStock}
        className={`group relative w-full py-4 rounded-full font-outfit font-bold text-sm tracking-widest overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:cursor-not-allowed
          ${!product.inStock 
            ? 'bg-tiko-surface-container text-tiko-on-surface-variant' 
            : isAdding 
            ? 'bg-tiko-tertiary text-white' 
            : 'bg-tiko-primary text-white shadow-lg shadow-tiko-primary/20 hover:shadow-tiko-primary/30'}`}
      >
        <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAdding ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {product.inStock ? 'ADD TO TIKO BAG' : 'OUT OF STOCK'}
          {product.inStock && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </span>
        
        {isAdding && (
          <span className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            ADDING...
          </span>
        )}
      </button>

      {/* Accordions */}
      <div className="pt-4 border-t border-tiko-outline-variant">
        <ProductAccordions 
          details={product.details} 
          composition={product.composition} 
          shipping={product.shipping} 
          returns={product.returns} 
        />
      </div>
    </div>
  );
};

export default ProductInfo;

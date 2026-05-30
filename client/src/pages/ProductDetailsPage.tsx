import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductRecommendations from '../components/product/ProductRecommendations';
import { productService } from '../services';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product-details', id],
    queryFn: () => productService.getById(id || ''),
    enabled: !!id,
    retry: 1,
  });

  // Adapt the fetched API product into the details view structure
  const adaptedProduct = useMemo(() => {
    if (!product) return null;

    // Collate all images (primary first, then all secondary sorted by order)
    const images: string[] = [];
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (img.url) images.push(img.url);
      });
    } else if (product.image) {
      images.push(product.image);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: 'JOD',
      inStock: product.availability !== 'sold-out',
      breadcrumbs: ['Shop All', product.category, product.name],
      colors: product.colors ?? [],
      sizes: product.sizes ?? [],
      images,
      details: product.description,
      composition: [
        product.material,
        'Premium quality craftsmanship',
        'Sourced from regional workshops',
        'Ethical & sustainable materials',
      ],
      shipping: 'Free standard delivery on all orders over 100 JOD. Standard delivery takes 2-3 business days within Amman.',
      returns: 'Easy 14-day returns and exchanges on non-used, original packaging items.',
      material: product.material,
    };
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-tiko-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="font-outfit font-bold text-sm text-tiko-on-surface-variant uppercase tracking-widest animate-pulse">
            Loading collection piece...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !adaptedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center">
        <svg className="text-tiko-outline" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <h2 className="font-outfit font-bold text-2xl text-tiko-on-surface mb-2">Piece Not Found</h2>
          <p className="text-tiko-on-surface-variant max-w-sm mx-auto text-sm">
            We couldn't retrieve the details for this item. It may have been removed or is currently unavailable.
          </p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-tiko-primary text-white rounded-full font-outfit text-sm font-bold shadow-lg shadow-tiko-primary/25 active:scale-[0.98] transition-all hover:bg-tiko-primary/95"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {adaptedProduct.breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === 0 ? (
              <Link
                to="/shop"
                className="text-[10px] font-bold uppercase tracking-widest text-tiko-outline hover:text-tiko-primary transition-colors"
              >
                {crumb}
              </Link>
            ) : (
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  i === adaptedProduct.breadcrumbs.length - 1
                    ? 'text-tiko-on-surface'
                    : 'text-tiko-outline'
                }`}
              >
                {crumb}
              </span>
            )}
            {i < adaptedProduct.breadcrumbs.length - 1 && (
              <span className="text-tiko-outline-variant">/</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Gallery (7 columns) */}
        <div className="lg:col-span-7">
          <ProductGallery images={adaptedProduct.images} />
        </div>

        {/* Right: Info (5 columns) */}
        <div className="lg:col-span-5">
          <ProductInfo product={adaptedProduct} />
        </div>
      </div>

      {/* Bottom: Recommendations */}
      <div className="mt-24">
        <ProductRecommendations currentProductId={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;

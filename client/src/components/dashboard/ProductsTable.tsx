import React from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import type { AdminProduct } from '../../types/admin';

export type Product = AdminProduct;

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-tiko-surface rounded-tiko-xl border border-tiko-surface-container-high shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-tiko-surface-container border-b border-tiko-surface-container-high">
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tiko-surface-container-high">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-tiko-on-surface-variant/60 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-tiko-outline" />
                    <p>No products found matching your search or selected filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-tiko-surface-container-low transition-colors">
                  {/* Product Pic & Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-tiko-outline-variant bg-tiko-surface-container">
                        <img src={product.image || null} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-tiko-on-surface">{product.name}</h4>
                        <p className="text-xs text-tiko-on-surface-variant">{product.material}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-tiko-on-surface font-medium">{product.category}</span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-tiko-primary">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tiko-on-surface-variant">
                    <span className={`font-bold ${product.stock === 0 ? 'text-tiko-error font-extrabold' : ''}`}>
                      {product.stock} units
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.availability === 'available' 
                        ? 'bg-green-100 text-green-700' 
                        : product.availability === 'limited' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {product.availability === 'available' 
                        ? 'In Stock' 
                        : product.availability === 'limited' 
                          ? 'Low Stock' 
                          : 'Sold Out'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-tiko-on-surface-variant hover:text-tiko-primary hover:bg-tiko-surface-container rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 text-tiko-on-surface-variant hover:text-tiko-error hover:bg-tiko-error-container rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

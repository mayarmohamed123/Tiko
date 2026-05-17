import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Product } from './ProductsTable';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  categories: string[];
  onAddCategory: (categoryName: string) => void;
  onSave: (productData: {
    name: string;
    material: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
  }) => void;
  mockImages: { name: string; url: string }[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onAddCategory,
  onSave,
  mockImages,
}) => {
  const [name, setName] = useState('');
  const [material, setMaterial] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // Add Category inline states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setMaterial(editingProduct.material);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
      setImage(editingProduct.image);
      setDescription(editingProduct.description);
    } else {
      setName('');
      setMaterial('');
      setCategory(categories[0] || '');
      setPrice(29);
      setStock(10);
      setImage(mockImages[0]?.url || '');
      setDescription('');
    }
    setIsAddingCategory(false);
    setNewCategoryName('');
  }, [editingProduct, categories, mockImages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !material.trim() || !category) return;
    onSave({
      name,
      material,
      category,
      price,
      stock,
      image,
      description,
    });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-tiko-md border border-tiko-outline-variant shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col font-dm-sans">
        {/* Modal Header */}
        <div className="p-6 border-b border-tiko-surface-container-high flex justify-between items-center bg-tiko-surface rounded-t-tiko-md">
          <h3 className="text-xl font-outfit font-bold text-tiko-on-surface">
            {editingProduct ? 'Modify Product Details' : 'Register New Product'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-tiko-surface-container rounded-full text-tiko-on-surface-variant transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clay Studio Teapot"
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60"
              />
            </div>

            {/* Material / Details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Material / Finish</label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Artisanal Ceramic"
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60"
              />
            </div>

            {/* Category Selector with inline creation */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Category</label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-xs font-bold text-tiko-primary hover:underline flex items-center space-x-1"
                >
                  {isAddingCategory ? 'Select Existing' : '+ Add New Category'}
                </button>
              </div>

              {isAddingCategory ? (
                <div className="flex gap-2 animate-slide-down">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name..."
                    className="flex-1 px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-3 bg-tiko-primary text-white font-bold text-xs rounded-xl hover:bg-tiko-primary/95 transition-all shadow-md shadow-tiko-primary/10 uppercase"
                  >
                    Create
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary transition-all bg-white text-tiko-on-surface cursor-pointer font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-tiko-outline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="29.00"
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60 font-semibold"
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Initial Stock Units</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder="10"
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60 font-semibold"
              />
            </div>

            {/* Mock Image Selector */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Product Visual Mock</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {mockImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(img.url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 relative transition-all bg-tiko-surface-container ${
                      image === img.url 
                        ? 'border-tiko-primary shadow-md scale-105' 
                        : 'border-transparent hover:border-tiko-outline-variant/60'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    {image === img.url && (
                      <div className="absolute top-1 right-1 bg-tiko-primary text-white rounded-full p-0.5">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide craft origin, dimensions, care details, or styling tips..."
                className="w-full px-4 py-3 bg-white border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiko-primary/20 focus:border-tiko-primary transition-all placeholder:text-tiko-outline-variant/60 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-tiko-surface-container-high flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-tiko-surface border border-tiko-outline-variant rounded-full text-sm font-bold text-tiko-on-surface-variant hover:bg-tiko-surface-container-low transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-tiko-primary hover:bg-tiko-primary-container text-white rounded-full text-sm font-bold shadow-lg shadow-tiko-primary/10 transition-all active:scale-[0.98]"
            >
              {editingProduct ? 'Update Item' : 'Register Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

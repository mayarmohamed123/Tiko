import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { type Product } from './ProductsTable';
import type { Category } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  categories: Category[];
  onAddCategory: (categoryName: string) => void;
  onSave: (
    productData: {
      name: string;
      material: string;
      categoryId: string;
      price: number;
      stock: number;
      description: string;
    },
    files: File[]
  ) => void;
  isSaving?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onAddCategory,
  onSave,
  isSaving = false,
}) => {
  const [name, setName] = useState('');
  const [material, setMaterial] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setMaterial(editingProduct.material);
      setCategoryId(editingProduct.categoryId);
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
      setDescription(editingProduct.description);
    } else {
      setName('');
      setMaterial('');
      setCategoryId(categories[0]?.id ?? '');
      setPrice(29);
      setStock(10);
      setDescription('');
    }
    setImageFiles([]);
    setIsAddingCategory(false);
    setNewCategoryName('');
  }, [editingProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !material.trim() || !categoryId) return;
    onSave(
      { name, material, categoryId, price, stock, description },
      imageFiles
    );
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const existingImages = editingProduct?.images ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-tiko-md border border-tiko-outline-variant shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col font-dm-sans">
        <div className="p-6 border-b border-tiko-surface-container-high flex justify-between items-center bg-tiko-surface rounded-t-tiko-md">
          <h3 className="text-xl font-outfit font-bold text-tiko-on-surface">
            {editingProduct ? 'Modify Product Details' : 'Register New Product'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-tiko-surface-container rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Material</label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Category</label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-xs font-bold text-tiko-primary hover:underline"
                >
                  {isAddingCategory ? 'Select Existing' : '+ Add New Category'}
                </button>
              </div>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
                    placeholder="Category name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-4 py-3 bg-tiko-primary text-white text-xs font-bold rounded-xl"
                  >
                    Create
                  </button>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Price (JOD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Stock</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">
                Product Images (Cloudinary)
              </label>
              {existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {existingImages.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt=""
                      className="aspect-square rounded-lg object-cover border border-tiko-outline-variant"
                    />
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-tiko-outline-variant px-4 py-6 hover:border-tiko-primary">
                <Upload className="h-6 w-6 text-tiko-primary" />
                <span className="text-sm text-tiko-on-surface-variant">
                  {imageFiles.length
                    ? `${imageFiles.length} file(s) selected`
                    : 'Click to upload (max 10)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                />
              </label>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-full text-sm font-bold border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-tiko-primary text-white rounded-full text-sm font-bold disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : editingProduct ? 'Update Item' : 'Register Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

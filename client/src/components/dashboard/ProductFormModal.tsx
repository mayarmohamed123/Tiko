import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  ImageIcon,
  Trash2,
  ZoomIn,
  FileImage,
  Info,
  GripVertical,
  Star,
} from 'lucide-react';
import { type Product } from './ProductsTable';
import type { Category } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingImage {
  file: File;
  objectUrl: string;
  width: number;
  height: number;
}

interface ExistingImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

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
      colors: string[];
      sizes: string[];
    },
    files: File[]
  ) => void;
  onDeleteImage?: (productId: string, imageId: string) => void;
  onSetPrimaryImage?: (productId: string, imageId: string) => void;
  isSaving?: boolean;
  isDeletingImage?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number; objectUrl: string }> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, objectUrl: url });
    img.onerror = () => resolve({ width: 0, height: 0, objectUrl: url });
    img.src = url;
  });

// ─── Sub-component: Pending Image Card ───────────────────────────────────────

interface PendingCardProps {
  img: PendingImage;
  index: number;
  isPrimary: boolean;
  onDelete: (index: number) => void;
  onPreview: (url: string, name: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  dragOverIndex: number | null;
}

const PendingCard: React.FC<PendingCardProps> = ({
  img, index, isPrimary, onDelete, onPreview,
  onDragStart, onDragOver, onDrop, dragOverIndex
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragOver={(e) => onDragOver(e, index)}
    onDrop={(e) => onDrop(e, index)}
    className={`group relative bg-tiko-surface-container-low rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing
      ${dragOverIndex === index ? 'border-tiko-primary scale-[1.02]' : isPrimary ? 'border-amber-400' : 'border-tiko-outline-variant'}`}
  >
    {/* Drag handle */}
    <div className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-3 h-3" />
    </div>

    {/* Preview thumbnail */}
    <div className="relative aspect-square bg-tiko-surface-container overflow-hidden">
      <img
        src={img.objectUrl}
        alt={img.file.name}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-tiko-on-surface/0 group-hover:bg-tiko-on-surface/30 transition-all duration-200 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPreview(img.objectUrl, img.file.name)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white"
          title="Preview"
        >
          <ZoomIn className="w-4 h-4 text-tiko-on-surface" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-tiko-error/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-tiko-error"
          title="Remove"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      {/* Primary / NEW badge */}
      {isPrimary ? (
        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5" fill="currentColor" /> Primary
        </span>
      ) : (
        <span className="absolute top-1.5 left-1.5 bg-tiko-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
          New
        </span>
      )}
    </div>

    {/* Metadata */}
    <div className="p-2.5 space-y-1">
      <p className="text-[10px] font-semibold text-tiko-on-surface truncate" title={img.file.name}>
        {img.file.name}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="inline-flex items-center gap-0.5 text-[9px] text-tiko-on-surface-variant bg-tiko-surface-container px-1.5 py-0.5 rounded-full">
          <Info className="w-2.5 h-2.5" />
          {formatBytes(img.file.size)}
        </span>
        {img.width > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[9px] text-tiko-on-surface-variant bg-tiko-surface-container px-1.5 py-0.5 rounded-full">
            {img.width}×{img.height}
          </span>
        )}
        <span className="inline-flex items-center gap-0.5 text-[9px] text-tiko-primary bg-tiko-primary/10 px-1.5 py-0.5 rounded-full uppercase">
          {img.file.type.split('/')[1] || 'img'}
        </span>
      </div>
    </div>
  </div>
);

// ─── Sub-component: Existing Image Card ──────────────────────────────────────

interface ExistingCardProps {
  img: ExistingImage;
  index: number;
  productId: string;
  onDelete: (productId: string, imageId: string) => void;
  onPreview: (url: string, name: string) => void;
  onSetPrimary: (productId: string, imageId: string) => void;
  isDeleting: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  dragOverIndex: number | null;
}

const ExistingCard: React.FC<ExistingCardProps> = ({
  img, index, productId, onDelete, onPreview, onSetPrimary,
  isDeleting, onDragStart, onDragOver, onDrop, dragOverIndex
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragOver={(e) => onDragOver(e, index)}
    onDrop={(e) => onDrop(e, index)}
    className={`group relative bg-tiko-surface-container-low rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing
      ${dragOverIndex === index ? 'border-tiko-primary scale-[1.02]' : img.isPrimary ? 'border-amber-400' : 'border-tiko-outline-variant'}`}
  >
    {/* Drag handle */}
    <div className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-3 h-3" />
    </div>

    {/* Thumbnail */}
    <div className="relative aspect-square bg-tiko-surface-container overflow-hidden">
      <img
        src={img.url}
        alt={img.altText ?? 'Product image'}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-tiko-on-surface/0 group-hover:bg-tiko-on-surface/30 transition-all duration-200 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPreview(img.url, img.altText ?? 'Product image')}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white"
          title="Preview"
        >
          <ZoomIn className="w-4 h-4 text-tiko-on-surface" />
        </button>
        {!img.isPrimary && (
          <button
            type="button"
            onClick={() => onSetPrimary(productId, img.id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-amber-500/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-amber-500"
            title="Set as primary photo"
          >
            <Star className="w-4 h-4 text-white" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(productId, img.id)}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-tiko-error/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-tiko-error disabled:opacity-50"
          title="Delete from server"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      {img.isPrimary && (
        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5" fill="currentColor" /> Primary
        </span>
      )}
    </div>

    {/* Metadata */}
    <div className="p-2.5 space-y-1">
      <p className="text-[10px] font-semibold text-tiko-on-surface truncate" title={img.url}>
        {img.altText ?? `Image #${img.sortOrder + 1}`}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="inline-flex items-center gap-0.5 text-[9px] text-tiko-on-surface-variant bg-tiko-surface-container px-1.5 py-0.5 rounded-full">
          {img.isPrimary ? '★ Primary' : `#${index + 1}`}
        </span>
      </div>
    </div>
  </div>
);

// ─── Image Lightbox ───────────────────────────────────────────────────────────

interface LightboxProps {
  url: string;
  name: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ url, name, onClose }) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
    onClick={onClose}
  >
    <div
      className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 bg-white/20 hover:bg-white/40 rounded-full p-1.5 text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={url}
        alt={name}
        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
      />
      <p className="text-white/70 text-xs text-center px-4 truncate max-w-full">{name}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onAddCategory,
  onSave,
  onDeleteImage,
  onSetPrimaryImage,
  isSaving = false,
  isDeletingImage = false,
}) => {
  const [name, setName] = useState('');
  const [material, setMaterial] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);
  const [isDraggingZone, setIsDraggingZone] = useState(false);

  // Drag-to-reorder state
  const [dragType, setDragType] = useState<'existing' | 'pending' | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    // Revoke old object URLs to avoid memory leaks
    pendingImages.forEach((p) => URL.revokeObjectURL(p.objectUrl));

    if (editingProduct) {
      setName(editingProduct.name);
      setMaterial(editingProduct.material);
      setCategoryId(editingProduct.categoryId);
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
      setDescription(editingProduct.description);
      setColors(editingProduct.colors ?? []);
      setSizes(editingProduct.sizes ?? []);
      setExistingImages([...(editingProduct.images ?? [])].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.sortOrder - b.sortOrder;
      }));
    } else {
      setName('');
      setMaterial('');
      setCategoryId(categories[0]?.id ?? '');
      setPrice(29);
      setStock(10);
      setDescription('');
      setColors([]);
      setSizes([]);
      setExistingImages([]);
    }
    setColorInput('');
    setSizeInput('');
    setPendingImages([]);
    setIsAddingCategory(false);
    setNewCategoryName('');
    setLightbox(null);
    setIsDraggingZone(false);
    setDragType(null);
    setDragIndex(null);
    setDragOverIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, isOpen]);

  // Sync existing images when product data changes (after delete/setPrimary)
  useEffect(() => {
    if (editingProduct?.images) {
      setExistingImages([...(editingProduct.images ?? [])].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.sortOrder - b.sortOrder;
      }));
    }
  }, [editingProduct?.images]);

  // ─── File processing ────────────────────────────────────────────────────────

  const processFiles = useCallback(async (incoming: File[]) => {
    // Filter to images only and respect the 10-image limit
    const imageFiles = incoming.filter((f) => f.type.startsWith('image/'));
    if (!imageFiles.length) return;

    const processed = await Promise.all(
      imageFiles.map(async (file) => {
        const { width, height, objectUrl } = await getImageDimensions(file);
        return { file, objectUrl, width, height } as PendingImage;
      })
    );

    setPendingImages((prev) => {
      const combined = [...prev, ...processed];
      // cap at 10
      return combined.slice(0, 10);
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) await processFiles(files);
    // Reset the input so the same files can be re-added if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePending = (index: number) => {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].objectUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ─── Drag-and-drop for the DROP ZONE ────────────────────────────────────────

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingZone(true);
  };

  const handleDropZoneDragLeave = () => setIsDraggingZone(false);

  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingZone(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  // ─── Drag-to-reorder existing images ────────────────────────────────────────

  const handleExistingDragStart = (e: React.DragEvent, index: number) => {
    setDragType('existing');
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleExistingDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragType === 'existing') setDragOverIndex(index);
  };

  const handleExistingDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (dragType !== 'existing' || dragIndex === null || dragIndex === targetIndex) {
      setDragType(null);
      setDragIndex(null);
      return;
    }

    setExistingImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      // Mark first in array as primary (optimistic)
      return updated.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    });

    // Call API to set primary — the image at position 0 after reorder
    setExistingImages((prev) => {
      const firstImg = prev[0];
      if (firstImg && !firstImg.isPrimary && editingProduct && onSetPrimaryImage) {
        onSetPrimaryImage(editingProduct.id, firstImg.id);
      }
      return prev;
    });

    setDragType(null);
    setDragIndex(null);
  };

  // ─── Drag-to-reorder pending images ─────────────────────────────────────────

  const handlePendingDragStart = (e: React.DragEvent, index: number) => {
    setDragType('pending');
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePendingDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragType === 'pending') setDragOverIndex(index);
  };

  const handlePendingDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (dragType !== 'pending' || dragIndex === null || dragIndex === targetIndex) {
      setDragType(null);
      setDragIndex(null);
      return;
    }

    setPendingImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });

    setDragType(null);
    setDragIndex(null);
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !material.trim() || !categoryId) return;
    onSave(
      { name, material, categoryId, price, stock, description, colors, sizes },
      pendingImages.map((p) => p.file)
    );
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const totalNewImages = pendingImages.length;
  const totalExistingImages = existingImages.length;
  const totalImages = totalNewImages + totalExistingImages;

  if (!isOpen) return null;

  return (
    <>
      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox url={lightbox.url} name={lightbox.name} onClose={() => setLightbox(null)} />
      )}

      {/* ── Modal Backdrop ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-tiko-on-surface/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl border border-tiko-outline-variant shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto flex flex-col font-dm-sans">

          {/* Header */}
          <div className="sticky top-0 z-10 px-5 sm:px-6 py-4 border-b border-tiko-surface-container-high flex justify-between items-center bg-white rounded-t-2xl">
            <div>
              <h3 className="text-lg sm:text-xl font-outfit font-bold text-tiko-on-surface">
                {editingProduct ? 'Modify Product Details' : 'Register New Product'}
              </h3>
              {totalImages > 0 && (
                <p className="text-xs text-tiko-on-surface-variant mt-0.5">
                  {totalExistingImages} saved · {totalNewImages} pending upload
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-tiko-surface-container rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">

            {/* ─── Basic fields ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Material</label>
                <input
                  type="text"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm focus:outline-none focus:border-tiko-primary focus:ring-2 focus:ring-tiko-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Category</label>
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
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Price (EGP)</label>
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
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Stock</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
                />
              </div>
            </div>

            {/* ─── Image Upload Section ──────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
                  Product Images
                </label>
                <span className="text-xs text-tiko-on-surface-variant">
                  {totalImages}/10 images
                </span>
              </div>

              {/* ── Drop zone ── */}
              {totalImages < 10 && (
                <div
                  onDragOver={handleDropZoneDragOver}
                  onDragLeave={handleDropZoneDragLeave}
                  onDrop={handleDropZoneDrop}
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 transition-all duration-200 cursor-pointer
                    ${isDraggingZone
                      ? 'border-tiko-primary bg-tiko-primary/5 scale-[1.01]'
                      : 'border-tiko-outline-variant hover:border-tiko-primary hover:bg-tiko-primary/5'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Hidden file input — Apple Safari compatible approach */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                    aria-label="Upload product images"
                  />

                  <div className={`p-3 rounded-full transition-colors ${isDraggingZone ? 'bg-tiko-primary text-white' : 'bg-tiko-surface-container text-tiko-primary'}`}>
                    <Upload className="w-6 h-6" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-tiko-on-surface">
                      {isDraggingZone ? 'Drop images here' : 'Click or drag & drop images'}
                    </p>
                    <p className="text-xs text-tiko-on-surface-variant mt-1">
                      JPEG, PNG, WebP, HEIC · Up to {10 - totalImages} more · Select all at once
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-5 py-2.5 bg-tiko-primary text-white text-xs font-bold rounded-full shadow-lg shadow-tiko-primary/20 hover:bg-tiko-primary/90 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <FileImage className="w-3.5 h-3.5" />
                      Browse Files
                    </span>
                  </button>
                </div>
              )}

              {/* ── Existing uploaded images grid ── */}
              {totalExistingImages > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-tiko-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3" />
                    Saved Photos ({totalExistingImages}) — drag to reorder · first = primary
                  </p>
                  <p className="text-[10px] text-amber-600 mb-2 flex items-center gap-1">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Drag the photo you want as the main photo to the first position
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((img, i) => (
                      <ExistingCard
                        key={img.id}
                        img={img}
                        index={i}
                        productId={editingProduct!.id}
                        onDelete={(pid, iid) => onDeleteImage?.(pid, iid)}
                        onPreview={(url, n) => setLightbox({ url, name: n })}
                        onSetPrimary={(pid, iid) => onSetPrimaryImage?.(pid, iid)}
                        isDeleting={isDeletingImage}
                        onDragStart={handleExistingDragStart}
                        onDragOver={handleExistingDragOver}
                        onDrop={handleExistingDrop}
                        dragOverIndex={dragType === 'existing' ? dragOverIndex : null}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Pending new images grid ── */}
              {pendingImages.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-tiko-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Upload className="w-3 h-3" />
                    Pending Upload ({pendingImages.length}) — drag to reorder
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {pendingImages.map((img, i) => (
                      <PendingCard
                        key={img.objectUrl}
                        img={img}
                        index={i}
                        isPrimary={i === 0 && existingImages.length === 0}
                        onDelete={handleRemovePending}
                        onPreview={(url, n) => setLightbox({ url, name: n })}
                        onDragStart={handlePendingDragStart}
                        onDragOver={handlePendingDragOver}
                        onDrop={handlePendingDrop}
                        dragOverIndex={dragType === 'pending' ? dragOverIndex : null}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-tiko-on-surface-variant mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3 shrink-0" />
                    These images will be uploaded to Cloudinary when you save.
                  </p>
                </div>
              )}

              {/* Empty state when editing and no images */}
              {totalImages === 0 && editingProduct && (
                <div className="flex flex-col items-center justify-center gap-2 py-4 text-tiko-on-surface-variant">
                  <ImageIcon className="w-8 h-8 opacity-30" />
                  <p className="text-xs">No images yet. Use the picker above to add some.</p>
                </div>
              )}
            </div>

            {/* ─── Colors ────────────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
                Available Colors
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = colorInput.trim().replace(/,$/, '');
                      if (val && !colors.includes(val)) {
                        setColors([...colors, val]);
                        setColorInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
                  placeholder="Type a color and press Enter (e.g. Clay, Sandstone)"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = colorInput.trim();
                    if (val && !colors.includes(val)) {
                      setColors([...colors, val]);
                      setColorInput('');
                    }
                  }}
                  className="px-4 py-3 bg-tiko-primary text-white text-xs font-bold rounded-xl hover:bg-tiko-primary/90 transition-all"
                >
                  Add
                </button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-tiko-surface-container-low rounded-xl border border-tiko-outline-variant/60">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-tiko-on-surface text-xs font-medium rounded-full border border-tiko-outline-variant shadow-sm"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => setColors(colors.filter((c) => c !== color))}
                        className="text-tiko-outline hover:text-tiko-error focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Sizes ─────────────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">
                Available Sizes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = sizeInput.trim().toUpperCase().replace(/,$/, '');
                      if (val && !sizes.includes(val)) {
                        setSizes([...sizes, val]);
                        setSizeInput('');
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm"
                  placeholder="Type a size and press Enter (e.g. S, M, L, XL)"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = sizeInput.trim().toUpperCase();
                    if (val && !sizes.includes(val)) {
                      setSizes([...sizes, val]);
                      setSizeInput('');
                    }
                  }}
                  className="px-4 py-3 bg-tiko-primary text-white text-xs font-bold rounded-xl hover:bg-tiko-primary/90 transition-all"
                >
                  Add
                </button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-tiko-surface-container-low rounded-xl border border-tiko-outline-variant/60">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-tiko-primary/10 text-tiko-primary text-xs font-bold rounded-full border border-tiko-primary/20"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => setSizes(sizes.filter((s) => s !== size))}
                        className="text-tiko-primary/60 hover:text-tiko-error focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Description ───────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-tiko-on-surface-variant uppercase tracking-wider">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-tiko-outline-variant rounded-xl text-sm resize-none"
              />
            </div>

            {/* ─── Footer Actions ─────────────────────────────────────────────── */}
            <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full text-sm font-bold border border-tiko-outline-variant hover:bg-tiko-surface-container transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-tiko-primary text-white rounded-full text-sm font-bold disabled:opacity-60 hover:bg-tiko-primary/90 active:scale-95 transition-all shadow-lg shadow-tiko-primary/20 order-1 sm:order-2"
              >
                {isSaving
                  ? (pendingImages.length > 0 ? `Uploading ${pendingImages.length} image(s)…` : 'Saving…')
                  : editingProduct ? 'Update Item' : 'Register Item'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

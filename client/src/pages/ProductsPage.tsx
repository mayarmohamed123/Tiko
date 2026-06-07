import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatCard } from '../components/dashboard/StatCard';
import { ProductsTable, type Product } from '../components/dashboard/ProductsTable';
import { ProductFilters } from '../components/dashboard/ProductFilters';
import { ProductFormModal } from '../components/dashboard/ProductFormModal';
import { PageLoader } from '../components/common/PageLoader';
import { categoryService, productService } from '../services';
import { mapApiProductToAdmin } from '../utils/adminMappers';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { Category } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';


export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);


  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productService.list(),
    select: (data) => data.map(mapApiProductToAdmin),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.list,
  });


  const createMutation = useMutation({
    mutationFn: async (payload: {
      form: Parameters<typeof productService.create>[0];
      files: File[];
    }) => {
      const created = await productService.create(payload.form);
      if (payload.files.length) {
        await productService.uploadImages(created.id, payload.files);
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product created');
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to create product')),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      form: Parameters<typeof productService.update>[1];
      files: File[];
    }) => {
      const updated = await productService.update(payload.id, payload.form);
      if (payload.files.length) {
        await productService.uploadImages(payload.id, payload.files);
      }
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product updated');
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to update product')),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to delete product')),
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productService.deleteImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Image deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to delete image')),
  });

  const setPrimaryImageMutation = useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productService.updateImage(productId, imageId, { isPrimary: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Primary photo updated');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to update primary photo')),
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to create category')),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Category and all associated products deleted successfully');
      setSelectedCategoryFilter('All');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Failed to delete category')),
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete Product',
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleAddCategory = (categoryName: string) => {
    createCategoryMutation.mutate({ name: categoryName });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${name}"? This will ALSO soft-delete all products belonging to this category!`,
      confirmText: 'Delete Category',
      onConfirm: () => deleteCategoryMutation.mutate(id),
    });
  };

  const handleSaveProduct = (
    formData: {
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
  ) => {
    const payload = {
      name: formData.name,
      material: formData.material,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
      stockQty: formData.stock,
      lowStockThreshold: 5,
      colors: formData.colors,
      sizes: formData.sizes,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, form: payload, files });
    } else {
      createMutation.mutate({ form: payload, files });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.material.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockItems = products.filter((p) => p.stock === 0).length;
  const averagePrice = products.length
    ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2)
    : '0.00';

  if (productsLoading) return <PageLoader />;

  return (
    <div className="space-y-8 font-dm-sans animate-fade-in">
      {productsError && (
        <p className="text-sm text-tiko-error">
          {getErrorMessage(productsError, 'Failed to load products')}
        </p>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Products Registry</h2>
          <p className="text-tiko-on-surface-variant text-sm">Connected to API — images upload to Cloudinary.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 bg-tiko-primary hover:bg-tiko-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-tiko-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Registered Products"
          value={products.length}
          subtitle={`${totalStockItems} total units in stock`}
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
        <StatCard
          title="Out Of Stock Items"
          value={outOfStockItems}
          subtitle="Needs immediate restock"
          subtitleColor={outOfStockItems > 0 ? 'text-tiko-error font-bold' : 'text-tiko-on-surface-variant'}
          bgColor="bg-tiko-surface"
          borderColor={outOfStockItems > 0 ? 'border-tiko-error-container' : 'border-tiko-outline-variant'}
        />
        <StatCard
          title="Average Product Price"
          value={`EGP ${averagePrice}`}
          subtitle="Based on currently listed items"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories as Category[]}
        selectedCategory={selectedCategoryFilter}
        onCategoryChange={setSelectedCategoryFilter}
        onDeleteCategory={handleDeleteCategory}
      />

      <ProductsTable
        products={filteredProducts}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <ProductFormModal
        key={`${isModalOpen ? 'open' : 'closed'}-${editingProduct?.id ?? 'new'}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories as Category[]}
        onAddCategory={handleAddCategory}
        onSave={handleSaveProduct}
        onDeleteImage={(productId, imageId) =>
          deleteImageMutation.mutate({ productId, imageId })
        }
        onSetPrimaryImage={(productId, imageId) =>
          setPrimaryImageMutation.mutate({ productId, imageId })
        }
        isSaving={createMutation.isPending || updateMutation.isPending}
        isDeletingImage={deleteImageMutation.isPending}
      />

      <ConfirmModal
        isOpen={Boolean(confirmConfig?.isOpen)}
        title={confirmConfig?.title || ''}
        message={confirmConfig?.message || ''}
        confirmText={confirmConfig?.confirmText}
        onConfirm={confirmConfig?.onConfirm || (() => {})}
        onCancel={() => setConfirmConfig(null)}
      />
    </div>
  );
};

export default ProductsPage;

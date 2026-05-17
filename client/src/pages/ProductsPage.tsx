import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { ProductsTable, type Product } from '../components/dashboard/ProductsTable';
import { ProductFilters } from '../components/dashboard/ProductFilters';
import { ProductFormModal } from '../components/dashboard/ProductFormModal';

// Import local mock product images
import container from '../assets/Container.webp';
import container1 from '../assets/Container1.webp';
import container2 from '../assets/Container2.webp';
import container3 from '../assets/Container3.webp';
import interiorDesign from '../assets/Interior Design.webp';
import backgroundImg from '../assets/Background.webp';

const INITIAL_CATEGORIES = [
  'Kitchen & Dining',
  'Textiles',
  'Wellness',
  'Home Decor',
  'Lighting'
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Clay Studio Teapot',
    material: 'Artisanal Ceramic',
    category: 'Kitchen & Dining',
    price: 85,
    stock: 24,
    image: container,
    availability: 'available',
    description: 'Hand-thrown stoneware with a unique matte glaze and a balanced pour spout.',
  },
  {
    id: 'p-2',
    name: 'Linen Napkin Set',
    material: 'Stone Washed',
    category: 'Textiles',
    price: 42,
    stock: 15,
    image: container1,
    availability: 'available',
    description: 'Set of four pre-washed Belgian linen napkins in our signature stone colour.',
  },
  {
    id: 'p-3',
    name: 'Walnut Serving Bowl',
    material: 'Sustainable Walnut',
    category: 'Kitchen & Dining',
    price: 120,
    stock: 0,
    image: container3,
    availability: 'sold-out',
    description: 'Each bowl is carved from a single piece of sustainable American walnut.',
  },
  {
    id: 'p-4',
    name: 'Botanical Soak',
    material: 'Organic Botanicals',
    category: 'Wellness',
    price: 34,
    stock: 45,
    image: container2,
    availability: 'available',
    description: 'Mineral-rich salts infused with organic lavender and chamomile for deep relaxation.',
  },
  {
    id: 'p-5',
    name: 'Santal Candle',
    material: 'Coconut Wax',
    category: 'Home Decor',
    price: 58,
    stock: 5,
    image: backgroundImg,
    availability: 'limited',
    description: 'A warm, woody blend of sandalwood and papyrus in a concrete vessel.',
  },
];

const MOCK_IMAGES = [
  { name: 'Sandalwood Bottle', url: container },
  { name: 'Belgian Linen Throw', url: container1 },
  { name: 'Botanical Salts Jar', url: container2 },
  { name: 'Artisan Clay Pot', url: container3 },
  { name: 'Minimal Travertine Lamp', url: interiorDesign },
  { name: 'Warm Soy Candle', url: backgroundImg },
];

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Open Modal to Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Delete Product
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Add category inline
  const handleAddCategory = (categoryName: string) => {
    if (categories.includes(categoryName)) {
      alert('Category already exists.');
      return;
    }
    setCategories([...categories, categoryName]);
  };

  // Save/Update Form
  const handleSaveProduct = (formData: {
    name: string;
    material: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
  }) => {
    const availability = formData.stock === 0 
      ? 'sold-out' 
      : formData.stock < 8 
        ? 'limited' 
        : 'available';

    if (editingProduct) {
      // Update
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        ...formData,
        availability,
      } : p));
    } else {
      // Create
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        ...formData,
        availability,
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.material.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate high-level stats
  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockItems = products.filter(p => p.stock === 0).length;
  const averagePrice = products.length ? (products.reduce((acc, p) => acc + p.price, 0) / products.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-8 font-dm-sans animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Products Registry</h2>
          <p className="text-tiko-on-surface-variant text-sm">Add, modify, and keep track of your neighborhood store items.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 bg-tiko-primary hover:bg-tiko-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-tiko-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </header>

      {/* Stats Cards at top of Products page */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          subtitleColor={outOfStockItems > 0 ? "text-tiko-error font-bold" : "text-tiko-on-surface-variant"}
          bgColor="bg-tiko-surface"
          borderColor={outOfStockItems > 0 ? "border-tiko-error-container" : "border-tiko-outline-variant"}
        />
        <StatCard 
          title="Average Product Price"
          value={`$${averagePrice}`}
          subtitle="Based on currently listed items"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
      </div>

      {/* Filter and Search Bar */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategory={selectedCategoryFilter}
        onCategoryChange={setSelectedCategoryFilter}
      />

      {/* Products Table Container */}
      <ProductsTable
        products={filteredProducts}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Reusable premium modal for Add / Edit */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        onAddCategory={handleAddCategory}
        onSave={handleSaveProduct}
        mockImages={MOCK_IMAGES}
      />
    </div>
  );
};

export default ProductsPage;

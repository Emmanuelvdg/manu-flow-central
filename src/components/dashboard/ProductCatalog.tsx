
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProductForm } from './AddProductForm';
import { ProductCard } from './components/ProductCard';
import { CartSection } from './components/CartSection';
import { ProductFilters } from './components/ProductFilters';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Product } from './types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
  variant?: Record<string, any>;
}

export const ProductCatalog = () => {
  const { products, loading } = useProducts();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        categories={categories}
        onCategoryChange={setFilterCategory}
        onAddProduct={() => setIsAddProductOpen(true)}
      />

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onClose={() => setIsAddProductOpen(false)} />
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              quantity={cartItems
                .filter(item => item.product.id === product.id)
                .reduce((sum, item) => sum + item.quantity, 0)}
            />
          ))}
        </div>
      )}

      <CartSection
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useProducts } from '@/components/dashboard/hooks/useProducts';
import { useCart } from '@/components/dashboard/hooks/useCart';
import { PublicProductCard } from './ProductCard';
import { CartSection } from './CartSection';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

export const PublicProductCatalog = () => {
  const { products, loading } = useProducts();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { config } = usePublicSiteConfig();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Our Products</h1>
        <p className="mt-4 text-lg text-gray-500">
          Browse our product catalog and request quotes for items you're interested in.
        </p>
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <div className="w-full md:w-64">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      ) : (
        <>
          <div className={`${config.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <PublicProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  quantity={cartItems
                    .filter(item => item.product.id === product.id)
                    .reduce((sum, item) => sum + item.quantity, 0)}
                  layout={config.layout}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>

          <CartSection 
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        </>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProductForm } from './AddProductForm';
import { ProductCard } from './components/ProductCard';
import { CartSection } from './components/CartSection';
import { mockProducts } from './data/mockProducts';
import { Product } from './types/product';

export const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { toast } = useToast();

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const addToCart = (product: Product) => {
    if (!cartItems.some(item => item.id === product.id)) {
      setCartItems([...cartItems, product]);
      toast({
        title: "Added to RFQ",
        description: `${product.name} has been added to your quote request.`,
      });
    } else {
      toast({
        title: "Already in RFQ",
        description: `${product.name} is already in your quote request.`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Removed from RFQ",
      description: "Item has been removed from your quote request.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          onClick={() => setIsAddProductOpen(true)}
          className="whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={filterCategory === '' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory('')}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onClose={() => setIsAddProductOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <CartSection
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
};

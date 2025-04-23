import React, { useState, useEffect } from 'react';
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
import { Product } from './types/product';
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  product: Product;
  quantity: number;
}

export const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx === -1) {
        toast({
          title: "Added to RFQ",
          description: `${product.name} has been added to your quote request.`,
        });
        return [...prev, { product, quantity: 1 }];
      } else {
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        toast({
          title: "Quantity Increased",
          description: `Increased quantity of ${product.name} to ${newCart[idx].quantity}.`,
        });
        return newCart;
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== id));
    toast({
      title: "Removed from RFQ",
      description: "Item has been removed from your quote request.",
    });
  };

  const updateQuantity = (productId: number, newQty: number) => {
    setCartItems(prev => {
      if (newQty < 1) {
        toast({
          title: "Removed from RFQ",
          description: "Item has been removed from your quote request.",
        });
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
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

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              quantity={cartItems.find(item => item.product.id === product.id)?.quantity || 0}
            />
          ))}
        </div>
      )}

      <CartSection
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onClearCart={() => setCartItems([])}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

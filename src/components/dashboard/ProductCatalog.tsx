
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
  variantId?: string;
  variant?: Record<string, any>;
}

export const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productVariants, setProductVariants] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Fetch products with variant types
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
          setLoading(false);
          return;
        }
        
        // Convert database records to our Product type with proper type handling
        const typedProducts = (data || []).map(item => {
          // Parse varianttypes JSON if needed
          let varianttypes = null;
          if (item.varianttypes) {
            try {
              if (typeof item.varianttypes === 'string') {
                varianttypes = JSON.parse(item.varianttypes);
              } else {
                varianttypes = item.varianttypes;
              }
            } catch (e) {
              console.error('Failed to parse varianttypes:', e);
            }
          }
          
          return {
            ...item,
            varianttypes
          } as Product;
        });
        
        setProducts(typedProducts);
        
        // Fetch variants for products that have them
        const productsWithVariants = typedProducts.filter(p => p.hasvariants);
        if (productsWithVariants.length > 0) {
          // Get all product IDs with variants
          const productIds = productsWithVariants.map(p => p.id);
          
          // Fetch all variants for these products
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .in('product_id', productIds);
            
          if (!variantsError && variantsData) {
            // Group variants by product ID
            const variantsByProduct: Record<string, any[]> = {};
            variantsData.forEach(variant => {
              if (!variantsByProduct[variant.product_id]) {
                variantsByProduct[variant.product_id] = [];
              }
              variantsByProduct[variant.product_id].push(variant);
            });
            
            setProductVariants(variantsByProduct);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({
          title: "Error loading products",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const addToCart = (product: Product, variantId?: string) => {
    setCartItems(prev => {
      // If product has variants and no variant is selected, alert user
      if (product.hasvariants && !variantId) {
        toast({
          title: "Select Variant",
          description: "Please select a product variant before adding to RFQ",
          variant: "destructive",
        });
        return prev;
      }
      
      // Find the variant object if variantId is provided
      let variant = undefined;
      if (variantId && productVariants[product.id]) {
        variant = productVariants[product.id].find(v => v.id === variantId);
      }
      
      // Check if item exists in cart (same product and same variant if applicable)
      const idx = prev.findIndex(item => 
        item.product.id === product.id && 
        ((!variantId && !item.variantId) || (item.variantId === variantId))
      );
      
      if (idx === -1) {
        // Item not in cart
        toast({
          title: "Added to RFQ",
          description: `${product.name}${variant ? ` (${formatVariantAttributes(variant.attributes)})` : ''} has been added to your quote request.`,
        });
        return [...prev, { product, quantity: 1, variantId, variant }];
      } else {
        // Item already in cart, increase quantity
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        toast({
          title: "Quantity Increased",
          description: `Increased quantity of ${product.name}${variant ? ` (${formatVariantAttributes(variant.attributes)})` : ''} to ${newCart[idx].quantity}.`,
        });
        return newCart;
      }
    });
  };
  
  // Helper to format variant attributes for display
  const formatVariantAttributes = (attributes: Record<string, string>): string => {
    return Object.entries(attributes)
      .map(([key, value]) => `${value}`)
      .join(', ');
  };

  const removeFromCart = (index: number) => {
    const item = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Removed from RFQ",
      description: `${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} has been removed from your quote request.`,
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    setCartItems(prev => {
      if (newQty < 1) {
        const item = prev[index];
        toast({
          title: "Removed from RFQ",
          description: `${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} has been removed from your quote request.`,
        });
        return prev.filter((_, i) => i !== index);
      }
      
      const newCart = [...prev];
      newCart[index].quantity = newQty;
      return newCart;
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
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
};

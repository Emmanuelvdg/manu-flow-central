import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '@/components/dashboard/types/product';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

// Define CartItem interface locally since it's not exported from useCart
export interface CartItem {
  product: Product;
  variantId: string | null;
  quantity: number;
}

interface PublicProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  quantity: number;
  layout?: 'grid' | 'list';
}

export const PublicProductCard: React.FC<PublicProductCardProps> = ({ product, onAddToCart, quantity, layout = 'grid' }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const { config } = usePublicSiteConfig();

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  // Fix SKU display - check if product has a SKU property
  const displaySku = selectedVariant ? selectedVariant.sku : (product as any).sku || 'N/A';
  
  const handleAddToCart = () => {
    onAddToCart({
      product,
      variantId: selectedVariantId,
      quantity: itemQuantity
    });
    setItemQuantity(1); // Reset quantity after adding
  };

  const incrementQuantity = () => setItemQuantity(prev => prev + 1);
  const decrementQuantity = () => setItemQuantity(prev => Math.max(1, prev - 1));

  // Apply color scheme from config
  const { colorScheme } = config;
  const primaryButtonStyle = colorScheme.primary !== 'hsl(var(--primary))' ? { backgroundColor: colorScheme.primary, color: '#ffffff' } : {};
  const secondaryButtonStyle = colorScheme.secondary !== 'hsl(var(--secondary))' ? { backgroundColor: colorScheme.secondary, color: '#ffffff' } : {};

  if (layout === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 lg:w-1/5">
            <img 
              src={product.image || '/placeholder.svg'} 
              alt={product.name} 
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <CardContent className="flex-1 p-5">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                <p className="mt-2 text-sm line-clamp-3">{product.description}</p>
                
                <div className="mt-3 flex items-center">
                  <span className="font-semibold text-lg">${displayPrice?.toFixed(2)}</span>
                  <span className="ml-2 text-xs text-gray-500">SKU: {displaySku}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end space-y-3">
                {product.variants && product.variants.length > 0 && (
                  <div className="w-full md:w-48">
                    <Select value={selectedVariantId || ''} onValueChange={value => setSelectedVariantId(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Variant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base">Base Product</SelectItem>
                        {product.variants.map(variant => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {Object.values(variant.attributes || {}).join(', ')} - ${variant.price?.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex space-x-3 items-center">
                  <div className="flex items-center border rounded">
                    <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-8 w-8">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-8 w-12 text-center border-0 p-0"
                    />
                    <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button onClick={handleAddToCart} style={primaryButtonStyle}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Quote
                  </Button>
                </div>
                
                {quantity > 0 && (
                  <p className="text-sm text-green-600">
                    {quantity} in quote
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Default grid layout
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square relative">
        <img 
          src={product.image || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {quantity}
          </div>
        )}
      </div>
      <CardContent className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{product.name}</h3>
            <span className="font-semibold">${displayPrice?.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <p className="mt-2 text-sm line-clamp-2">{product.description}</p>
        </div>
        
        <div className="mt-4 space-y-3">
          {product.variants && product.variants.length > 0 && (
            <Select value={selectedVariantId || ''} onValueChange={value => setSelectedVariantId(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Base Product</SelectItem>
                {product.variants.map(variant => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {Object.values(variant.attributes || {}).join(', ')} - ${variant.price?.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="flex space-x-2 items-center">
            <div className="flex items-center border rounded flex-1">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-8 w-8 p-0">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-8 w-full text-center border-0 p-0"
              />
              <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={handleAddToCart} className="w-full" style={primaryButtonStyle}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

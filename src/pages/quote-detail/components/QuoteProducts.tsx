
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductItem {
  name: string;
  quantity: number;
  price?: number;
  [key: string]: any;
}

interface QuoteProductsProps {
  products: ProductItem[] | any;
}

export const QuoteProducts: React.FC<QuoteProductsProps> = ({ products }) => {
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return `$${price.toFixed(2)}`;
  };
  
  // Handle different product formats safely
  const normalizeProducts = (): ProductItem[] => {
    if (!products) return [];
    
    if (Array.isArray(products)) {
      return products;
    }
    
    if (typeof products === 'object') {
      return Object.values(products);
    }
    
    return [];
  };
  
  const normalizedProducts = normalizeProducts();
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {normalizedProducts.length > 0 ? (
            normalizedProducts.map((product, index) => {
              // Extract quantity - can be directly in the product or in attributes
              const quantity = product.quantity || 1;
              
              // Extract price - can be directly in the product or undefined
              const price = product.price;
              
              // Calculate total if price exists
              const total = price !== undefined ? price * quantity : undefined;
              
              // Extract name - could be directly or in other properties
              const name = product.name || product.product_name || `Product #${index + 1}`;
              
              return (
                <TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell className="text-right">{formatPrice(price)}</TableCell>
                  <TableCell className="text-right">{formatPrice(total)}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No products in this quote
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

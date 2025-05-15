
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomProduct } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomProductsListProps {
  quoteId: string;
}

export const CustomProductsList: React.FC<CustomProductsListProps> = ({ quoteId }) => {
  // Fetch custom products for this quote
  const { data: customProducts, isLoading } = useQuery<CustomProduct[]>({
    queryKey: ['custom-products', quoteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_products')
        .select('*')
        .eq('quote_id', quoteId);
        
      if (error) throw error;
      return data || [];
    },
  });
  
  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  if (!customProducts || customProducts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic mt-2">
        No custom products for this quote
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      {customProducts.map((product) => (
        <div 
          key={product.id} 
          className="border rounded-md p-4 bg-muted/20"
        >
          <h4 className="font-medium">{product.name}</h4>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          )}
          
          {product.documents && product.documents.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Documents:</p>
              <div className="flex flex-wrap gap-2">
                {product.documents.map((doc: any, index: number) => (
                  <div 
                    key={index} 
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                  >
                    {doc.file_name || `Document ${index + 1}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

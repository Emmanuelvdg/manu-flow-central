
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '../types/product';
import { useToast } from '@/hooks/use-toast';
import { parseJsonField } from '../utils/productUtils';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
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
        
        const typedProducts = (data || []).map(item => {
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

  return { products, loading, setProducts };
};

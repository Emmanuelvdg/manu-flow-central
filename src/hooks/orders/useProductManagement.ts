
import { supabase } from "@/integrations/supabase/client";

export const useProductManagement = () => {
  const findOrCreateProduct = async (productName: string, productId: string, orderId: string) => {
    // First, check if the product exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('name', productName)
      .maybeSingle();
      
    if (existingProduct) {
      console.log(`Found existing product ${existingProduct.id} for "${productName}"`);
      return existingProduct.id;
    }
    
    // Create a new product if it doesn't exist
    console.log(`Product "${productName}" doesn't exist in products table, creating a stub product`);
    const { data: newProduct, error: createProductError } = await supabase
      .from('products')
      .insert({
        id: productId || `prod-${Date.now()}`,
        name: productName,
        description: `Auto-generated from order ${orderId}`,
        category: 'General'
      })
      .select()
      .single();
      
    if (createProductError) {
      console.error(`Failed to create product for "${productName}":`, createProductError);
      throw createProductError;
    }
    
    console.log(`Created stub product with ID ${newProduct.id}`);
    return newProduct.id;
  };

  return { findOrCreateProduct };
};

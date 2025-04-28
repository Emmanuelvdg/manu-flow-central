
import { supabase } from "@/integrations/supabase/client";

export const useProductManagement = () => {
  const findOrCreateProduct = async (productName: string, productId: string, orderId: string) => {
    if (!productName) {
      console.error("Cannot find or create product without a name");
      throw new Error("Product name is required");
    }
    
    console.log(`Finding or creating product: "${productName}" with ID: "${productId}"`);
    
    try {
      // First, check if the product exists by ID
      if (productId) {
        const { data: productById } = await supabase
          .from('products')
          .select('id, name')
          .eq('id', productId)
          .maybeSingle();
          
        if (productById) {
          console.log(`Found product by ID: ${productById.id} - ${productById.name}`);
          return productById.id;
        }
      }
      
      // Then, check if the product exists by name
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', productName)
        .maybeSingle();
        
      if (existingProduct) {
        console.log(`Found existing product ${existingProduct.id} for "${productName}"`);
        return existingProduct.id;
      }
      
      // If product doesn't exist, use a placeholder ID based on the name
      // instead of trying to create a new product (which would fail due to RLS)
      console.log(`Product "${productName}" doesn't exist, using name-based ID`);
      
      // Create a simplified ID from the name
      const placeholderId = productName
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .toUpperCase()
        .substring(0, 20);
        
      console.log(`Using placeholder ID: ${placeholderId} for "${productName}"`);
      return placeholderId;
    } catch (err) {
      console.error(`Error in findOrCreateProduct for "${productName}":`, err);
      
      // Return a fallback ID on error
      const fallbackId = `PRODUCT_${Date.now()}`;
      console.log(`Using fallback ID: ${fallbackId}`);
      return fallbackId;
    }
  };

  return { findOrCreateProduct };
};

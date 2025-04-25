
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
      
      // Create a new product if it doesn't exist
      console.log(`Product "${productName}" doesn't exist, creating a stub product`);
      let finalProductId = productId;
      
      // If no product ID was provided, generate one
      if (!finalProductId) {
        // Try to create a simplified ID from the name
        finalProductId = productName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toUpperCase()
          .substring(0, 10);
          
        if (finalProductId.length < 2) {
          finalProductId = `PROD_${Date.now()}`;
        }
      }
      
      const { data: newProduct, error: createProductError } = await supabase
        .from('products')
        .insert({
          id: finalProductId,
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
    } catch (err) {
      console.error(`Error in findOrCreateProduct for "${productName}":`, err);
      throw err;
    }
  };

  return { findOrCreateProduct };
};

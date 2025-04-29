
import { supabase } from "@/integrations/supabase/client";

export const useProductManagement = () => {
  const findOrCreateProduct = async (productName: string, productId: string, orderId: string) => {
    if (!productName) {
      console.error("Cannot find or create product without a name");
      throw new Error("Product name is required");
    }
    
    // Clean product name by removing quantity information (e.g., "Wooden Table x 6" -> "Wooden Table")
    const cleanProductName = productName.replace(/\s+x\s+\d+$/, '').trim();
    
    console.log(`Finding or creating product: "${cleanProductName}" (original: "${productName}") with ID: "${productId}"`);
    
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
      
      // Then, check if the product exists by clean name
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', cleanProductName)
        .maybeSingle();
        
      if (existingProduct) {
        console.log(`Found existing product ${existingProduct.id} for "${cleanProductName}"`);
        return existingProduct.id;
      }
      
      // Create a new product if it doesn't exist
      console.log(`Product "${cleanProductName}" doesn't exist, creating a new product`);
      
      // Generate a product ID if none was provided
      const finalProductId = productId || cleanProductName
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .toUpperCase()
        .substring(0, 20);
      
      const { data: newProduct, error: createError } = await supabase
        .from('products')
        .insert({
          id: finalProductId,
          name: cleanProductName,
          description: `Auto-generated from order ${orderId}`,
          category: 'General'
        })
        .select()
        .single();
        
      if (createError) {
        console.error(`Failed to create product for "${cleanProductName}":`, createError);
        throw createError;
      }
      
      console.log(`Created new product with ID ${newProduct.id}`);
      return newProduct.id;
      
    } catch (err) {
      console.error(`Error in findOrCreateProduct for "${cleanProductName}":`, err);
      throw err;
    }
  };

  return { findOrCreateProduct };
};

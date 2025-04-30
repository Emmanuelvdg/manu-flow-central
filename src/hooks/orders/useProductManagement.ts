
import { supabase } from "@/integrations/supabase/client";

export const useProductManagement = () => {
  const findOrCreateProduct = async (productName: string, productId: string, orderId: string) => {
    if (!productName) {
      console.error("Cannot find or create product without a name");
      throw new Error("Product name is required");
    }
    
    // Clean product name by removing quantity information (e.g., "Wooden Table x 6" -> "Wooden Table")
    const cleanProductName = productName.replace(/\s+x\s+\d+$/, '').trim();
    
    console.log(`Finding product: "${cleanProductName}" (original: "${productName}") with ID: "${productId}"`);
    
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
      
      // If we get here, the product doesn't exist in the catalog
      // We'll use a normalized ID for reference only, BUT WE WON'T CREATE A NEW PRODUCT
      const referenceId = productId || 
        `REF_${cleanProductName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .toUpperCase()
          .substring(0, 15)}`;
      
      console.log(`Product "${cleanProductName}" doesn't exist in catalog, using reference ID: ${referenceId}`);
      return referenceId;
    } catch (err) {
      console.error(`Error in findOrCreateProduct for "${cleanProductName}":`, err);
      throw err;
    }
  };

  return { findOrCreateProduct };
};

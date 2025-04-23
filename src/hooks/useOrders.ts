
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { ProductData } from "@/types/orderTypes";
import { parseOrderRow } from "@/utils/orderUtils";
import { createOrderFromQuote, fetchQuotes } from "@/components/dashboard/quotes/quoteUtils";

export const useOrders = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const { toast } = useToast();

  // Filter/search state
  const [search, setSearch] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [partsStatusFilter, setPartsStatusFilter] = useState("");

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (fetchError) throw fetchError;
      
      console.log("Fetched orders:", data);
      return data ? data.map(parseOrderRow) : [];
    }
  });

  const resetAndRecreatAllOrders = async () => {
    try {
      toast({
        title: "Reset in progress",
        description: "Cleaning up related references...",
      });
      
      // Step 1: First, update all shipments to remove references to order_id
      const { error: updateShipmentsError } = await supabase
        .from("shipments")
        .update({ order_id: null })
        .neq("id", "00000000-0000-0000-0000-000000000000");
      
      if (updateShipmentsError) {
        console.error("Error updating shipments:", updateShipmentsError);
        toast({
          title: "Reset failed",
          description: "Failed to update shipment references: " + updateShipmentsError.message,
          variant: "destructive",
        });
        return;
      }
      
      // Step 2: Delete order_products entries first
      const { error: deleteProductsError } = await supabase
        .from("order_products")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
        
      if (deleteProductsError) {
        console.error("Error deleting order products:", deleteProductsError);
        toast({
          title: "Reset failed",
          description: "Failed to delete order products: " + deleteProductsError.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Reset in progress",
        description: "Deleting all existing orders...",
      });
      
      // Step 3: Now delete all orders
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete everything
      
      if (deleteError) {
        console.error("Error deleting orders:", deleteError);
        toast({
          title: "Reset failed",
          description: "Failed to delete orders: " + deleteError.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Orders deleted",
        description: "Now recreating orders from all accepted quotes...",
      });
      
      // Step 4: Fetch all accepted quotes
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .eq("status", "accepted");
      
      if (quotesError) {
        console.error("Error fetching quotes:", quotesError);
        throw quotesError;
      }

      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        toast({
          title: "Complete",
          description: "No accepted quotes found to create orders from.",
        });
        refetch();
        return;
      }
      
      // Step 5: Create new orders for each accepted quote
      let successCount = 0;
      let errorCount = 0;
      
      for (const quote of acceptedQuotes) {
        try {
          await createOrderFromQuote(quote);
          successCount++;
        } catch (err) {
          console.error(`Error creating order for quote ${quote.quote_number}:`, err);
          errorCount++;
        }
      }
      
      toast({
        title: "Recreation complete",
        description: `Successfully created ${successCount} orders. ${errorCount > 0 ? `Failed to create ${errorCount} orders.` : ''}`,
      });
      
      // Refetch to update the UI
      refetch();
      
    } catch (err: any) {
      console.error("Error in resetAndRecreatAllOrders:", err);
      toast({
        title: "Reset failed",
        description: err.message || "An error occurred while resetting orders",
        variant: "destructive",
      });
    }
  };

  const syncAcceptedQuotes = async () => {
    try {
      toast({
        title: "Syncing orders",
        description: "Checking for accepted quotes without orders...",
      });
      
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("id, quote_number, customer_name, products, total, status")
        .eq("status", "accepted");
      
      if (quotesError) throw quotesError;

      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        toast({
          title: "Sync complete",
          description: "No new orders to create.",
        });
        return;
      }

      let newOrdersCount = 0;
      
      for (const quote of acceptedQuotes) {
        // Use select() instead of maybeSingle() to get all existing orders for the quote
        const { data: existingOrders, error: orderCheckError } = await supabase
          .from("orders")
          .select("id")
          .eq("quote_id", quote.id);
          
        if (orderCheckError) {
          console.error(`Error checking orders for quote ${quote.quote_number}:`, orderCheckError);
          continue;
        }
        
        // Only create a new order if no orders exist for this quote
        if (!existingOrders || existingOrders.length === 0) {
          const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          
          const orderPayload = {
            quote_id: quote.id,
            order_number: orderNumber,
            customer_name: quote.customer_name,
            products: quote.products,
            total: quote.total,
            status: 'created',
            parts_status: 'Not booked'
          };
          
          const { data: newOrder, error: createError } = await supabase
            .from('orders')
            .insert(orderPayload)
            .select();
            
          if (createError) {
            console.error(`Error creating order for quote ${quote.quote_number}:`, createError);
            continue;
          }
          
          if (newOrder && newOrder[0] && quote.products && Array.isArray(quote.products)) {
            for (const product of quote.products as ProductData[]) {
              if (!product.name && !product.id) continue;
              
              let recipeId = null;
              
              if (product.id) {
                const { data: recipes } = await supabase
                  .from('recipes')
                  .select('id')
                  .eq('product_id', product.id)
                  .maybeSingle();
                  
                if (recipes) {
                  recipeId = recipes.id;
                }
              }
              
              const productEntry = {
                order_id: newOrder[0].id,
                product_id: product.id || product.name,
                quantity: parseInt(String(product.quantity)) || 1,
                unit: product.unit || 'pcs',
                status: 'pending',
                materials_status: 'Not booked',
                recipe_id: recipeId
              };
              
              await supabase
                .from('order_products')
                .insert(productEntry);
            }
          }
          
          newOrdersCount++;
        }
      }
      
      toast({
        title: "Sync complete",
        description: `Created ${newOrdersCount} new orders from accepted quotes.`,
      });
      
      refetch();
      
    } catch (err: any) {
      console.error("Error in syncAcceptedQuotes:", err);
      toast({
        title: "Sync error",
        description: err.message || "An error occurred while syncing orders",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (search && !Object.values(order).join(" ").toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter && order.status !== statusFilter) return false;
    if (partsStatusFilter && order.partsStatus !== partsStatusFilter) return false;
    const qtyNum = parseInt(order.quantity);
    if (quantityRange.min && qtyNum < parseInt(quantityRange.min)) return false;
    if (quantityRange.max && qtyNum > parseInt(quantityRange.max)) return false;
    return true;
  });

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    selected,
    setSelected,
    search,
    setSearch,
    quantityRange,
    setQuantityRange,
    statusFilter,
    setStatusFilter,
    partsStatusFilter,
    setPartsStatusFilter,
    syncAcceptedQuotes,
    resetAndRecreatAllOrders,
    refetch
  };
};

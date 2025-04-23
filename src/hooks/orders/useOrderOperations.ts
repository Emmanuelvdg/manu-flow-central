
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createOrderFromQuote } from "@/components/dashboard/quotes/quoteUtils";

export const useOrderOperations = (refetch: () => void) => {
  const { toast } = useToast();

  const resetAndRecreatAllOrders = async () => {
    try {
      toast({
        title: "Reset in progress",
        description: "Cleaning up related references...",
      });
      
      // Step 1: Update shipments
      const { error: updateShipmentsError } = await supabase
        .from("shipments")
        .update({ order_id: null })
        .neq("id", "00000000-0000-0000-0000-000000000000");
      
      if (updateShipmentsError) {
        console.error("Error updating shipments:", updateShipmentsError);
        throw updateShipmentsError;
      }
      
      // Step 2: Delete order_products
      const { error: deleteProductsError } = await supabase
        .from("order_products")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
        
      if (deleteProductsError) {
        console.error("Error deleting order products:", deleteProductsError);
        throw deleteProductsError;
      }
      
      toast({
        title: "Reset in progress",
        description: "Deleting all existing orders...",
      });
      
      // Step 3: Delete orders
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      
      if (deleteError) {
        console.error("Error deleting orders:", deleteError);
        throw deleteError;
      }
      
      toast({
        title: "Orders deleted",
        description: "Now recreating orders from all accepted quotes...",
      });
      
      // Step 4: Fetch accepted quotes
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .eq("status", "accepted");
      
      if (quotesError) throw quotesError;

      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        toast({
          title: "Complete",
          description: "No accepted quotes found to create orders from.",
        });
        refetch();
        return;
      }
      
      // Step 5: Create new orders
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
        .select("*")
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
        const { data: existingOrders, error: orderCheckError } = await supabase
          .from("orders")
          .select("id")
          .eq("quote_id", quote.id);
          
        if (orderCheckError) {
          console.error(`Error checking orders for quote ${quote.quote_number}:`, orderCheckError);
          continue;
        }
        
        if (!existingOrders || existingOrders.length === 0) {
          try {
            await createOrderFromQuote(quote);
            newOrdersCount++;
          } catch (err) {
            console.error(`Error creating order for quote ${quote.quote_number}:`, err);
          }
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

  return {
    resetAndRecreatAllOrders,
    syncAcceptedQuotes
  };
};

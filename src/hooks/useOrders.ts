
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'processing':
    case 'created':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-orange-100 text-orange-800';
    default:
      return '';
  }
};

// Improved parser that better extracts and normalizes data from order rows
const parseOrderRow = (row: any): Order => {
  const productInfo = row.products && Array.isArray(row.products) && row.products.length > 0
    ? row.products[0]
    : null;
  
  const totalQuantity = row.products && Array.isArray(row.products) 
    ? row.products.reduce((sum: number, prod: any) => sum + (parseInt(prod.quantity) || 0), 0)
    : 0;
    
  return {
    number: row.order_number || "-",
    groupName: productInfo?.category || "-",
    partNo: productInfo?.id || "-",
    partDescription: productInfo?.name || "-",
    quantity: String(totalQuantity) || "0",
    status: row.status || "-",
    partsStatus: row.parts_status || "-",
    partsStatusColor: getStatusColor(row.parts_status),
    statusColor: getStatusColor(row.status),      
    editable: true,
    checked: false,
    customerName: row.customer_name,
    total: row.total,
    products: row.products || []
  };
};

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
      return data ? data.map(parseOrderRow) : [];
    }
  });

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
        const { data: existingOrder, error: orderCheckError } = await supabase
          .from("orders")
          .select("id")
          .eq("quote_id", quote.id)
          .maybeSingle();
          
        if (orderCheckError) {
          console.error(`Error checking order for quote ${quote.quote_number}:`, orderCheckError);
          continue;
        }
        
        if (!existingOrder) {
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
          
          // Create order_products entries for better data normalization
          if (newOrder && newOrder[0] && quote.products && Array.isArray(quote.products)) {
            for (const product of quote.products) {
              if (!product.name && !product.id) continue;
              
              // Find recipe for this product if exists
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
                quantity: parseInt(product.quantity) || 1,
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
      
      // Refresh the orders list
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
    refetch
  };
};

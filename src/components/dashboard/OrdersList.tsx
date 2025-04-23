
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { columnHeaders } from "@/data/mockOrders";
import { Order } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Improved parser that better extracts and normalizes data from order rows
const parseOrderRow = (row: any): Order => {
  // Extract product details if available
  const productInfo = row.products && Array.isArray(row.products) && row.products.length > 0
    ? row.products[0]
    : null;
  
  // Calculate total quantity from all products
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
    total: row.total
  };
};

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

export const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter/search state
  const [search, setSearch] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [partsStatusFilter, setPartsStatusFilter] = useState("");

  // Check if any accepted quotes are missing orders and sync them
  const syncAcceptedQuotes = async () => {
    try {
      toast({
        title: "Syncing orders",
        description: "Checking for accepted quotes without orders...",
      });
      
      // Find quotes that have been accepted but don't have corresponding orders
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("id, quote_number, customer_name, products, total, status")
        .eq("status", "accepted");
      
      if (quotesError) {
        console.error("Error fetching accepted quotes:", quotesError);
        throw quotesError;
      }

      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        console.log("No accepted quotes found needing synchronization");
        toast({
          title: "Sync complete",
          description: "No new orders to create.",
        });
        return;
      }

      console.log(`Found ${acceptedQuotes.length} accepted quotes to check`);
      let newOrdersCount = 0;
      
      // For each accepted quote, check if an order exists
      for (const quote of acceptedQuotes) {
        // Check if an order exists for this quote
        const { data: existingOrder, error: orderCheckError } = await supabase
          .from("orders")
          .select("id")
          .eq("quote_id", quote.id)
          .maybeSingle();
          
        if (orderCheckError) {
          console.error(`Error checking order for quote ${quote.quote_number}:`, orderCheckError);
          continue;
        }
        
        // If no order exists, create one
        if (!existingOrder) {
          console.log(`Creating missing order for accepted quote ${quote.quote_number}`);
          
          // Create a new order based on quote data
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
            .select()
            .single();
            
          if (createError) {
            console.error(`Error creating order for quote ${quote.quote_number}:`, createError);
            continue;
          }
          
          console.log(`Successfully created order ${orderNumber} for quote ${quote.quote_number}`);
          newOrdersCount++;
          
          // Update any shipments related to this quote with the new order ID
          if (newOrder) {
            const { error: shipmentError } = await supabase
              .from('shipments')
              .update({ order_id: newOrder.id })
              .eq('quote_id', quote.id);
              
            if (shipmentError) {
              console.error(`Error updating shipments for quote ${quote.quote_number}:`, shipmentError);
            }
          }
        }
      }
      
      // After synchronization, refresh the orders list
      await fetchOrders();
      
      toast({
        title: "Sync complete",
        description: `Created ${newOrdersCount} new orders from accepted quotes.`,
      });
    } catch (err: any) {
      console.error("Error in syncAcceptedQuotes:", err);
      toast({
        title: "Sync error",
        description: err.message || "An error occurred while syncing orders",
        variant: "destructive",
      });
    }
  };

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (data) {
        const parsed = data.map(parseOrderRow);
        setOrders(parsed);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    // Run synchronization first, then fetch orders
    syncAcceptedQuotes().then(() => {
      fetchOrders();
    });
  }, []);

  const isChecked = (idx: number) => selected.includes(idx);

  const toggleCheck = (idx: number) => {
    setSelected((sels) =>
      sels.includes(idx) ? sels.filter((i) => i !== idx) : [...sels, idx]
    );
  };

  const handleOrderClick = (orderNumber: string) => {
    navigate(`/orders/${orderNumber}`);
  };

  const handleCreateOrder = () => {
    // Navigate to quotes page to create an order from a quote
    navigate('/quotes');
  };

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    if (
      search &&
      !Object.values(order)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    if (statusFilter && order.status !== statusFilter) return false;
    if (partsStatusFilter && order.partsStatus !== partsStatusFilter) return false;
    const qtyNum = parseInt(order.quantity);
    if (quantityRange.min && qtyNum < parseInt(quantityRange.min)) return false;
    if (quantityRange.max && qtyNum > parseInt(quantityRange.max)) return false;
    return true;
  });

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">Manufacturing orders</span>
          <Button size="sm" className="ml-4 flex items-center" onClick={handleCreateOrder}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Printer className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr className="bg-white">
                {columnHeaders.map((col) => (
                  <th
                    key={col.key}
                    className={`text-xs font-semibold px-4 py-2 border-b border-gray-100 ${col.className || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
              <OrdersFilters
                search={search}
                setSearch={setSearch}
                quantityRange={quantityRange}
                setQuantityRange={setQuantityRange}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                partsStatusFilter={partsStatusFilter}
                setPartsStatusFilter={setPartsStatusFilter}
              />
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12 text-blue-600">
                    Loading orders...
                  </td>
                </tr>
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12 text-red-600">
                    Error loading orders: {error}
                  </td>
                </tr>
              </tbody>
            ) : (
              <OrdersTable
                filteredOrders={filteredOrders}
                selected={selected}
                isChecked={isChecked}
                toggleCheck={toggleCheck}
                handleOrderClick={handleOrderClick}
              />
            )}
          </table>
          <div className="flex justify-center items-center mt-4 pb-4">
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-700" 
              onClick={syncAcceptedQuotes}
            >
              Sync Orders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

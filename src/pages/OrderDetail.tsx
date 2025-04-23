
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for normalized order product
type OrderProductRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit: string;
  status: string;
  materials_status: string;
  materials_progress: number | null;
  personnel_progress: number | null;
  machines_progress: number | null;
  notes: string | null;
  recipe_id: string | null;
  // for UI
  product_name: string | null;
  product_description: string | null;
  group: string | null;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Fetch order data (still needed for metadata)
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    meta: {
      onError: () => {
        toast({
          title: "Error loading order",
          description: `Could not load order #${id}. Please try again later.`,
          variant: "destructive",
        });
      }
    }
  });

  // Fetch normalized order products, joined with product info
  const { data: orderProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['orderProducts', id],
    queryFn: async () => {
      if (!id) return [];
      // Must first query order to get internal order.id
      const { data: orderRow } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', id)
        .maybeSingle();
      if (!orderRow) return [];
      // Query order_products joined with products
      const { data, error } = await supabase
        .from('order_products')
        .select(`
          *,
          products:product_id (
            name,
            description,
            category
          )
        `)
        .eq('order_id', orderRow.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        ...row,
        product_name: row.products?.name ?? null,
        product_description: row.products?.description ?? null,
        group: row.products?.category ?? null,
      }));
    },
    enabled: !!id,
  });

  // Define state for order metadata form
  const [formData, setFormData] = useState({
    customerName: "",
    status: "Processing",
    shippingAddress: "",
  });

  // Update form when order metadata is loaded
  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customer_name || "",
        status: order.status || "Processing",
        shippingAddress: order.shipping_address || "",
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveOrder = async () => {
    if (!order) return;
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: formData.customerName,
          status: formData.status,
          shipping_address: formData.shippingAddress,
        })
        .eq('order_number', id);
      if (error) throw error;
      toast({
        title: "Order updated",
        description: `Order #${id} has been successfully updated.`,
      });
    } catch (err) {
      console.error("Error updating order:", err);
      toast({
        title: "Update failed",
        description: "Could not update the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title={`Order Detail - ${id}`}>
      <div className="max-w-4xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              {isLoading ? "Loading..." : `Order #${order?.order_number || id}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-4 text-center">Loading order details...</div>
            ) : error ? (
              <div className="text-red-500 py-4 text-center">Error loading order</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer Name</label>
                    <input 
                      type="text" 
                      name="customerName"
                      className="w-full rounded border p-2" 
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                      name="status"
                      className="w-full rounded border p-2" 
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>Submitted</option>
                      <option>Processing</option>
                      <option>Completed</option>
                      <option>Fulfilled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Address</label>
                  <input 
                    type="text" 
                    name="shippingAddress"
                    className="w-full rounded border p-2" 
                    value={formData.shippingAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Products & Progress</h3>
                  {productsLoading ? (
                    <div className="text-muted-foreground italic text-center py-2">Loading products...</div>
                  ) : orderProducts.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-2">No products found</div>
                  ) : (
                    orderProducts.map((product: OrderProductRow, idx: number) => (
                      <div key={product.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{product.product_name || "Unknown Product"}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity} {product.unit} | Group: {product.group || "General"}
                            </p>
                            {product.product_description && (
                              <p className="text-xs text-muted-foreground">{product.product_description}</p>
                            )}
                          </div>
                          <Link 
                            to={product.recipe_id ? `/recipes/${product.recipe_id}` : "#"}
                            className={`text-sm ${product.recipe_id ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"}`}
                            tabIndex={product.recipe_id ? 0 : -1}
                            aria-disabled={!product.recipe_id}
                          >
                            View Recipe
                          </Link>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Materials</span>
                              <span>{product.materials_progress ?? 0}%</span>
                            </div>
                            <Progress value={product.materials_progress ?? 0} />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Personnel</span>
                              <span>{product.personnel_progress ?? 0}%</span>
                            </div>
                            <Progress value={product.personnel_progress ?? 0} />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Machines</span>
                              <span>{product.machines_progress ?? 0}%</span>
                            </div>
                            <Progress value={product.machines_progress ?? 0} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="button" 
              className="ml-auto" 
              disabled={isLoading}
              onClick={handleSaveOrder}
            >
              Save Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;


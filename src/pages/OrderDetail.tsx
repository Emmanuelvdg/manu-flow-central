
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

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Fetch order data from Supabase - modified to search by order_number instead of id
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) return null;
      
      // Query by order_number instead of id
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', id)
        .single();
        
      if (error) {
        console.error("Error fetching order:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
    onError: (error) => {
      toast({
        title: "Error loading order",
        description: `Could not load order #${id}. Please try again later.`,
        variant: "destructive",
      });
    }
  });

  // Placeholder for mocked progress data that would normally come from the database
  const getProgressData = (productId: string) => ({
    materials: Math.floor(Math.random() * 100),
    personnel: Math.floor(Math.random() * 100),
    machines: Math.floor(Math.random() * 100)
  });

  // Define state for the form
  const [formData, setFormData] = useState({
    customerName: "",
    status: "Processing",
    shippingAddress: "",
  });

  // Update form when order data is loaded
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

  // Process products from order data
  const processedProducts = order?.products ? 
    Array.isArray(order.products) ? 
      order.products.map((p: any) => ({
        id: p.id || `prod-${Math.random().toString(36).substr(2, 9)}`,
        name: p.name || "Unknown Product",
        quantity: p.quantity || 1,
        group: p.group || "General",
        progress: getProgressData(p.id || "")
      })) : [] : [];

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
                  {processedProducts.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-2">No products found</div>
                  ) : (
                    processedProducts.map((product: any, idx: number) => (
                      <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity} | Group: {product.group}
                            </p>
                          </div>
                          <Link 
                            to={`/recipes/${product.id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Recipe
                          </Link>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Materials</span>
                              <span>{product.progress.materials}%</span>
                            </div>
                            <Progress value={product.progress.materials} />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Personnel</span>
                              <span>{product.progress.personnel}%</span>
                            </div>
                            <Progress value={product.progress.personnel} />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Machines</span>
                              <span>{product.progress.machines}%</span>
                            </div>
                            <Progress value={product.progress.machines} />
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

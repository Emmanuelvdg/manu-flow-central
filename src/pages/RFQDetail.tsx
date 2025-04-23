
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RFQDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    location: "",
    products: "",
    status: "Draft",
  });
  
  const { data: rfq, isLoading, error } = useQuery({
    queryKey: ['rfq', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('rfqs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error fetching RFQ:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  // Update form when RFQ data is loaded
  useEffect(() => {
    if (rfq) {
      setFormData({
        customer_name: rfq.customer_name || "",
        customer_email: rfq.customer_email || "",
        location: rfq.location || "",
        products: Array.isArray(rfq.products) 
          ? rfq.products.map(p => p.name || p).join(", ")
          : rfq.products,
        status: rfq.status || "Draft",
      });
    }
  }, [rfq]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Saving RFQ:", formData);
  };

  return (
    <MainLayout title={`RFQ Detail - ${id}`}>
      <div className="max-w-2xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/rfqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFQs
          </Link>
        </Button>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              {isLoading ? 'Loading...' : `RFQ #${rfq?.rfq_number || id}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-4 text-center">Loading RFQ details...</div>
            ) : error ? (
              <div className="text-red-500 py-4 text-center">Error loading RFQ</div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    name="customer_name"
                    className="w-full rounded border p-2" 
                    placeholder="Customer Name" 
                    value={formData.customer_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    name="customer_email"
                    className="w-full rounded border p-2" 
                    placeholder="Contact Email" 
                    value={formData.customer_email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    className="w-full rounded border p-2" 
                    placeholder="Delivery Location" 
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product(s)</label>
                  <textarea 
                    name="products"
                    className="w-full rounded border p-2" 
                    placeholder="Products requested..." 
                    value={formData.products}
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
                    <option>Draft</option>
                    <option>Submitted</option>
                    <option>Quoted</option>
                    <option>Processed</option>
                  </select>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save RFQ</Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RFQDetail;

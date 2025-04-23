
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

// Define the form schema
const packingListSchema = z.object({
  packingListNumber: z.string().min(1, "Packing List Number is required"),
  invoiceNumber: z.string().min(1, "Invoice Number is required"),
  exportDate: z.string().min(1, "Date of Export is required"),
  shipperInfo: z.string().min(1, "Shipper's Contact Information is required"),
  exporterInfo: z.string().min(1, "Exporter Contact Information is required"),
  consigneeInfo: z.string().min(1, "Consignee Contact Information is required"),
  originAddress: z.string().min(1, "Origin Address is required"),
  deliveryAddress: z.string().min(1, "Delivery Address is required"),
  numberOfPackages: z.string().transform(val => parseInt(val)).refine(val => !isNaN(val) && val > 0, "Must be a positive number"),
  totalVolume: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= 0, "Must be a valid number"),
  totalWeight: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= 0, "Must be a valid number"),
});

// Define the package item schema separately
const packageItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  numberOfItems: z.number().min(1, "Must be at least 1"),
  volume: z.number().min(0, "Must be a valid number"),
  weight: z.number().min(0, "Must be a valid number"),
});

interface PackingListFormProps {
  shipmentId: string;
  invoiceId?: string;
  invoiceNumber?: string;
}

export const PackingListForm: React.FC<PackingListFormProps> = ({ 
  shipmentId, 
  invoiceId,
  invoiceNumber 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [packageItems, setPackageItems] = useState<Array<{
    description: string;
    numberOfItems: number;
    volume: number;
    weight: number;
  }>>([]);
  const [existingData, setExistingData] = useState<any>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof packingListSchema>>({
    resolver: zodResolver(packingListSchema),
    defaultValues: {
      packingListNumber: "",
      invoiceNumber: invoiceNumber || "",
      exportDate: new Date().toISOString().split('T')[0],
      shipperInfo: "",
      exporterInfo: "",
      consigneeInfo: "",
      originAddress: "",
      deliveryAddress: "",
      numberOfPackages: "1",
      totalVolume: "0",
      totalWeight: "0",
    },
  });

  // Fetch existing packing list data if available
  useEffect(() => {
    const fetchPackingList = async () => {
      try {
        const { data, error } = await supabase
          .from("shipping_documents")
          .select("*")
          .eq("shipment_id", shipmentId)
          .eq("document_type", "packing-list")
          .single();
          
        if (error) {
          console.error("Error fetching packing list:", error);
          return;
        }
        
        if (data) {
          setExistingData(data);
          const content = data.content;
          
          // Populate form with existing data
          form.reset({
            packingListNumber: content.packingListNumber || "",
            invoiceNumber: content.invoiceNumber || invoiceNumber || "",
            exportDate: content.exportDate || new Date().toISOString().split('T')[0],
            shipperInfo: content.shipperInfo || "",
            exporterInfo: content.exporterInfo || "",
            consigneeInfo: content.consigneeInfo || "",
            originAddress: content.originAddress || "",
            deliveryAddress: content.deliveryAddress || "",
            numberOfPackages: content.numberOfPackages?.toString() || "1",
            totalVolume: content.totalVolume?.toString() || "0",
            totalWeight: content.totalWeight?.toString() || "0",
          });
          
          // Set package items if they exist
          if (content.packageItems && Array.isArray(content.packageItems)) {
            setPackageItems(content.packageItems);
          }
        }
      } catch (error) {
        console.error("Error in fetching packing list:", error);
      }
    };
    
    fetchPackingList();
  }, [shipmentId, invoiceNumber]);

  // Add a new empty package item
  const addPackageItem = () => {
    setPackageItems([
      ...packageItems,
      { description: "", numberOfItems: 1, volume: 0, weight: 0 }
    ]);
  };

  // Remove a package item at the given index
  const removePackageItem = (index: number) => {
    const newItems = [...packageItems];
    newItems.splice(index, 1);
    setPackageItems(newItems);
    
    // Recalculate totals
    calculateTotals(newItems);
  };

  // Update a package item at the given index
  const updatePackageItem = (index: number, key: string, value: any) => {
    const newItems = [...packageItems];
    (newItems[index] as any)[key] = key === 'description' ? value : parseFloat(value);
    setPackageItems(newItems);
    
    // Recalculate totals whenever an item changes
    calculateTotals(newItems);
  };

  // Calculate total volume and weight
  const calculateTotals = (items: typeof packageItems) => {
    const totalVol = items.reduce((sum, item) => sum + item.volume, 0);
    const totalWt = items.reduce((sum, item) => sum + item.weight, 0);
    
    form.setValue("totalVolume", totalVol.toFixed(2));
    form.setValue("totalWeight", totalWt.toFixed(2));
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof packingListSchema>) => {
    try {
      setIsLoading(true);
      
      // Validate package items
      let isValid = true;
      packageItems.forEach(item => {
        try {
          packageItemSchema.parse(item);
        } catch (error) {
          isValid = false;
          toast({
            title: "Validation Error",
            description: "Please check all package details are filled correctly",
            variant: "destructive",
          });
        }
      });
      
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      
      // Prepare data for saving
      const packingListData = {
        ...values,
        packageItems,
        numberOfPackages: parseInt(values.numberOfPackages.toString()),
        totalVolume: parseFloat(values.totalVolume.toString()),
        totalWeight: parseFloat(values.totalWeight.toString()),
      };
      
      // Save to database
      const { error } = existingData 
        ? await supabase
            .from("shipping_documents")
            .update({ 
              content: packingListData,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingData.id)
        : await supabase
            .from("shipping_documents")
            .insert({
              shipment_id: shipmentId,
              document_type: "packing-list",
              content: packingListData,
              status: "completed",
              invoice_id: invoiceId
            });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Packing list saved successfully",
      });
    } catch (error) {
      console.error("Error saving packing list:", error);
      toast({
        title: "Error",
        description: "Failed to save packing list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Packing List</h3>
        <p className="text-sm text-muted-foreground">
          Please complete the packing list form below with details about the shipment.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Document Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="packingListNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packing List Number</FormLabel>
                      <FormControl>
                        <Input placeholder="PL-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="INV-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exportDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Export</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shipperInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipper's Contact Information</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Name, phone, email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exporterInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter Contact Information</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Name, phone, email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consigneeInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consignee Contact Information</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Name, phone, email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete origin address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Complete delivery address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="font-medium">Package Details</h3>
                <FormField
                  control={form.control}
                  name="numberOfPackages"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Number of Packages</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Package Items */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Package Contents</h4>
                
                {packageItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <FormLabel className="text-xs">Description</FormLabel>
                      <Input 
                        value={item.description}
                        onChange={(e) => updatePackageItem(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel className="text-xs"># Items</FormLabel>
                      <Input 
                        type="number" 
                        min="1"
                        value={item.numberOfItems}
                        onChange={(e) => updatePackageItem(index, 'numberOfItems', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel className="text-xs">Volume (m³)</FormLabel>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={item.volume}
                        onChange={(e) => updatePackageItem(index, 'volume', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormLabel className="text-xs">Weight (kg)</FormLabel>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={item.weight}
                        onChange={(e) => updatePackageItem(index, 'weight', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removePackageItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackageItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Package Item
                </Button>
              </div>
              
              {/* Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <FormField
                  control={form.control}
                  name="totalVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Shipment Volume (m³)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Shipment Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (existingData ? "Update Packing List" : "Save Packing List")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

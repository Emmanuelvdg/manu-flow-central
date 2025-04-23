
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const exportDeclarationSchema = z.object({
  exporterName: z.string().min(1, "Exporter name is required"),
  exporterAddress: z.string().min(1, "Exporter address is required"),
  exporterTaxId: z.string().min(1, "Exporter tax/registration ID is required"),
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerAddress: z.string().min(1, "Buyer address is required"),
  buyerTaxId: z.string().min(1, "Buyer tax/registration ID is required"),
  hasBroker: z.boolean().default(false),
  brokerName: z.string().optional(),
  brokerAddress: z.string().optional(),
  brokerReference: z.string().optional(),
  transportMode: z.string().min(1, "Transport mode is required"),
  destinationCountry: z.string().min(1, "Destination country is required"),
  containerNumber: z.string().optional(),
  goodsDescription: z.string().min(1, "Goods description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  value: z.string().min(1, "Value is required"),
  currencyCode: z.string().min(1, "Currency code is required"),
  declarationDate: z.string().min(1, "Declaration date is required"),
  relatedDocuments: z.string().optional(),
});

// Define a type for the document content 
type ExportDeclarationContent = z.infer<typeof exportDeclarationSchema>;

// Define type for shipping document
interface ShippingDocument {
  id: string;
  shipment_id: string;
  document_type: string;
  content?: ExportDeclarationContent;
  status: string;
  created_at: string;
  updated_at: string;
  file_path?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
}

interface ExportDeclarationFormProps {
  shipmentId: string;
}

export const ExportDeclarationForm: React.FC<ExportDeclarationFormProps> = ({ 
  shipmentId 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingData, setExistingData] = useState<ShippingDocument | null>(null);
  
  const form = useForm<z.infer<typeof exportDeclarationSchema>>({
    resolver: zodResolver(exportDeclarationSchema),
    defaultValues: {
      exporterName: "",
      exporterAddress: "",
      exporterTaxId: "",
      buyerName: "",
      buyerAddress: "",
      buyerTaxId: "",
      hasBroker: false,
      brokerName: "",
      brokerAddress: "",
      brokerReference: "",
      transportMode: "sea",
      destinationCountry: "",
      containerNumber: "",
      goodsDescription: "",
      quantity: "",
      value: "",
      currencyCode: "USD",
      declarationDate: new Date().toISOString().split('T')[0],
      relatedDocuments: "",
    },
  });
  
  const hasBroker = form.watch("hasBroker");

  useEffect(() => {
    const fetchExportDeclaration = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_documents')
          .select("*")
          .eq("shipment_id", shipmentId)
          .eq("document_type", "export-declaration")
          .single();
          
        if (error) {
          console.error("Error fetching export declaration:", error);
          return;
        }
        
        if (data) {
          setExistingData(data as ShippingDocument);
          
          if (data.content) {
            const content = data.content as ExportDeclarationContent;
            form.reset({
              ...content,
              declarationDate: content?.declarationDate || new Date().toISOString().split('T')[0],
            });
          }
        }
      } catch (error) {
        console.error("Error in fetching export declaration:", error);
      }
    };
    
    fetchExportDeclaration();
  }, [shipmentId, form]);

  const onSubmit = async (values: z.infer<typeof exportDeclarationSchema>) => {
    try {
      setIsLoading(true);

      const { error } = existingData 
        ? await supabase
            .from('shipping_documents')
            .update({ 
              content: values,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingData.id)
        : await supabase
            .from('shipping_documents')
            .insert({
              shipment_id: shipmentId,
              document_type: "export-declaration",
              content: values,
              status: "completed"
            });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Export declaration saved successfully",
      });
    } catch (error) {
      console.error("Error saving export declaration:", error);
      toast({
        title: "Error",
        description: "Failed to save export declaration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Export Declaration</h3>
        <p className="text-sm text-muted-foreground">
          Please complete the export declaration form with details about the exported goods.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Exporter Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="exporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter Legal Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exporterAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exporterTaxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax/Registration ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Buyer Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Legal Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyerTaxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax/Registration ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Customs Broker</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasBroker" 
                    checked={hasBroker}
                    onCheckedChange={(checked) => 
                      form.setValue("hasBroker", checked === true)
                    }
                  />
                  <Label htmlFor="hasBroker">Shipment handled by customs broker</Label>
                </div>
                
                {hasBroker && (
                  <>
                    <FormField
                      control={form.control}
                      name="brokerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Broker Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brokerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Broker Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brokerReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Broker Reference Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Shipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="transportMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Means of Transport</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sea">Sea Freight</SelectItem>
                          <SelectItem value="air">Air Freight</SelectItem>
                          <SelectItem value="road">Road Transport</SelectItem>
                          <SelectItem value="rail">Rail Transport</SelectItem>
                          <SelectItem value="multimodal">Multimodal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., United States" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="containerNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Number (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="declarationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Declaration Date</FormLabel>
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

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Goods Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="goodsDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of Goods</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Detailed description of the exported goods" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 100 units" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currencyCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="relatedDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List of Related Documents</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="e.g., Commercial Invoice #12345, Packing List #6789, etc."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (existingData ? "Update Declaration" : "Save Declaration")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

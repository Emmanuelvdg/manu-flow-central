
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackingListForm } from "./documents/PackingListForm";
import { DocumentUpload } from "./documents/DocumentUpload";
import { ExportDeclarationForm } from "./documents/ExportDeclarationForm";
import { FileText } from "lucide-react";

interface ShippingDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: any;
}

export const ShippingDocumentsDialog: React.FC<ShippingDocumentsDialogProps> = ({
  open,
  onOpenChange,
  shipment,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Determine which document types are required based on the quote's incoterms
  const quoteIncoterms = shipment.incoterms || "exw"; // Default to EXW if not specified
  
  const requiresExportDeclaration = ["exw", "fob", "cif"].includes(quoteIncoterms.toLowerCase());
  const requiresInsuranceCertificate = ["cif", "cip"].includes(quoteIncoterms.toLowerCase());
  const requiresBillOfLading = ["cif", "ddp"].includes(quoteIncoterms.toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Shipping Documents - Shipment {shipment.id}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 h-12 items-center">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="purchase-order" className="text-sm">Purchase Order</TabsTrigger>
            <TabsTrigger value="packing-list" className="text-sm">Packing List</TabsTrigger>
            <TabsTrigger value="certificate" className="text-sm">Certificate</TabsTrigger>
            <TabsTrigger value="export-declaration" className="text-sm">Export Declaration</TabsTrigger>
            <TabsTrigger value="license" className="text-sm">License/Permits</TabsTrigger>
            <TabsTrigger value="insurance" className="text-sm">Insurance</TabsTrigger>
            <TabsTrigger value="delivery" className="text-sm">Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                <ul className="space-y-3">
                  {[
                    { title: "Purchase Order", icon: FileText },
                    { title: "Packing List", icon: FileText },
                    { title: "Certificate of Origin", icon: FileText },
                    ...(requiresExportDeclaration ? [{ title: "Export Declaration", icon: FileText }] : []),
                    { title: "Export License/Permits (if applicable)", icon: FileText },
                    ...(requiresInsuranceCertificate ? [{ title: "Insurance Certificate", icon: FileText }] : []),
                    ...(requiresBillOfLading ? [{ title: "Bill of Lading (B/L)", icon: FileText }] : []),
                    { title: "Delivery Order", icon: FileText },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium mb-2 text-sm">Document Status</h4>
                <p className="text-sm text-muted-foreground">
                  Based on the incoterms {quoteIncoterms.toUpperCase()}, 
                  please complete all required documents.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Purchase Order Tab */}
          <TabsContent value="purchase-order">
            <DocumentUpload 
              shipmentId={shipment.id} 
              documentType="purchase-order"
              title="Purchase Order"
              description="Upload the signed purchase order document"
            />
          </TabsContent>

          {/* Packing List Tab */}
          <TabsContent value="packing-list">
            <PackingListForm 
              shipmentId={shipment.id}
              invoiceId={shipment.invoice_id}
              invoiceNumber={shipment.invoice_number}
            />
          </TabsContent>

          {/* Certificate of Origin Tab */}
          <TabsContent value="certificate">
            <DocumentUpload 
              shipmentId={shipment.id} 
              documentType="certificate-of-origin"
              title="Certificate of Origin"
              description="Upload the certificate of origin document"
            />
          </TabsContent>

          {/* Export Declaration Tab */}
          <TabsContent value="export-declaration">
            {requiresExportDeclaration ? (
              <ExportDeclarationForm shipmentId={shipment.id} />
            ) : (
              <div className="p-4 bg-muted rounded-md">
                <p>Export Declaration is not required for the current incoterms.</p>
              </div>
            )}
          </TabsContent>

          {/* Export License/Permits Tab */}
          <TabsContent value="license">
            <DocumentUpload 
              shipmentId={shipment.id} 
              documentType="export-license"
              title="Export License/Permits"
              description="Upload any required export licenses or permits"
            />
          </TabsContent>

          {/* Insurance Certificate Tab */}
          <TabsContent value="insurance">
            {requiresInsuranceCertificate ? (
              <DocumentUpload 
                shipmentId={shipment.id} 
                documentType="insurance-certificate"
                title="Insurance Certificate"
                description="Upload the insurance certificate document"
                required={true}
              />
            ) : (
              <div className="p-4 bg-muted rounded-md">
                <p>Insurance Certificate is not required for the current incoterms.</p>
              </div>
            )}
          </TabsContent>

          {/* Delivery Documents Tab */}
          <TabsContent value="delivery">
            <div className="space-y-6">
              {requiresBillOfLading && (
                <DocumentUpload 
                  shipmentId={shipment.id} 
                  documentType="bill-of-lading"
                  title="Bill of Lading (B/L)"
                  description="Upload the bill of lading document"
                  required={true}
                />
              )}
              
              <DocumentUpload 
                shipmentId={shipment.id} 
                documentType="delivery-order"
                title="Delivery Order"
                description="Upload the delivery order document"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

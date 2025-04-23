
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackingListForm } from "./documents/PackingListForm";
import { DocumentUpload } from "./documents/DocumentUpload";
import { ExportDeclarationForm } from "./documents/ExportDeclarationForm";

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
          <DialogTitle>Shipping Documents - Shipment {shipment.id}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-8">
            <TabsTrigger value="overview" className="col-span-1">Overview</TabsTrigger>
            <TabsTrigger value="purchase-order" className="col-span-1">Purchase Order</TabsTrigger>
            <TabsTrigger value="packing-list" className="col-span-1">Packing List</TabsTrigger>
            <TabsTrigger value="certificate" className="col-span-1">Certificate</TabsTrigger>
            <TabsTrigger value="export-declaration" className="col-span-1">Export Declaration</TabsTrigger>
            <TabsTrigger value="license" className="col-span-1">License/Permits</TabsTrigger>
            <TabsTrigger value="insurance" className="col-span-1">Insurance</TabsTrigger>
            <TabsTrigger value="delivery" className="col-span-1">Delivery</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Required Documents</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Purchase Order</li>
                <li>Packing List</li>
                <li>Certificate of Origin</li>
                {requiresExportDeclaration && <li>Export Declaration</li>}
                <li>Export License/Permits (if applicable)</li>
                {requiresInsuranceCertificate && <li>Insurance Certificate</li>}
                {requiresBillOfLading && <li>Bill of Lading (B/L)</li>}
                <li>Delivery Order</li>
              </ul>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Document Status</h4>
                <p className="text-sm text-muted-foreground">
                  Based on the incoterms {quoteIncoterms ? quoteIncoterms.toUpperCase() : 'N/A'}, 
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

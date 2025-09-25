
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchShipmentsWithLinks } from "@/components/dashboard/shipments/fetchShipmentsWithLinks";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";
import { ShippingDocumentsDialog } from "@/components/dashboard/shipments/ShippingDocumentsDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ShipmentsDashboard = () => {
  const navigate = useNavigate();
  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ["shipments-dashboard"],
    queryFn: fetchShipmentsWithLinks,
  });

  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);

  const handleOpenDocuments = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsDocumentsDialogOpen(true);
  };

  return (
    <MainLayout title="Orders">
      <div className="h-full w-full">
        <Card className="shadow-sm h-full flex flex-col">
          <CardHeader className="px-4 py-4 sm:px-6 flex-shrink-0">
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            {isLoading && <div className="py-6 text-center">Loading orders...</div>}
            {error && <div className="text-red-500 py-6 text-center">Error loading orders</div>}
            <ScrollArea className="h-full w-full">
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[clamp(120px,15vw,160px)]">Order ID</TableHead>
                      <TableHead className="w-[clamp(80px,10vw,120px)]">RFQ</TableHead>
                      <TableHead className="w-[clamp(80px,10vw,120px)]">Quote</TableHead>
                      <TableHead className="w-[clamp(80px,10vw,120px)]">Order</TableHead>
                      <TableHead className="w-[clamp(80px,10vw,120px)]">Invoice</TableHead>
                      <TableHead className="w-[clamp(80px,10vw,120px)]">ETA</TableHead>
                      <TableHead className="w-[clamp(140px,18vw,180px)]">Shipping Documents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(shipments.length === 0 && !isLoading) ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shipments.map((shipment: any) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="table-cell-responsive font-medium">
                            {shipment.id}
                          </TableCell>
                          <TableCell className="table-cell-responsive">
                            {shipment.rfq_id ? (
                              <Button
                                size="sm"
                                variant="link"
                                className="p-0 h-auto text-left"
                                onClick={() => navigate(`/rfqs/${shipment.rfq_id}`)}
                              >
                                {shipment.rfq_number ?? shipment.rfq_id}
                              </Button>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="table-cell-responsive">
                            {shipment.quote_id ? (
                              <Button
                                size="sm"
                                variant="link"
                                className="p-0 h-auto text-left"
                                onClick={() => navigate(`/quotes/${shipment.quote_id}`)}
                              >
                                {shipment.quote_number ?? shipment.quote_id}
                              </Button>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="table-cell-responsive">
                            {shipment.order_id ? (
                              <Button
                                size="sm"
                                variant="link"
                                className="p-0 h-auto text-left"
                                onClick={() => navigate(`/orders/${shipment.order_id}`)}
                              >
                                {shipment.order_number ?? shipment.order_id}
                              </Button>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="table-cell-responsive">
                            {shipment.invoice_id ? (
                              <Button
                                size="sm"
                                variant="link"
                                className="p-0 h-auto text-left"
                                onClick={() => navigate(`/invoices/${shipment.invoice_id}`)}
                              >
                                {shipment.invoice_number ?? shipment.invoice_id}
                              </Button>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="table-cell-responsive">
                            {shipment.eta
                              ? new Date(shipment.eta).toLocaleDateString()
                              : (shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : "-")}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleOpenDocuments(shipment)}
                              className="whitespace-nowrap text-xs"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Manage </span>Documents
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedShipment && (
          <ShippingDocumentsDialog
            open={isDocumentsDialogOpen}
            onOpenChange={setIsDocumentsDialogOpen}
            shipment={selectedShipment}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ShipmentsDashboard;

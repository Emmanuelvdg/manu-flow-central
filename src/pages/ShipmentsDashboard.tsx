
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchShipmentsWithLinks } from "@/components/dashboard/shipments/fetchShipmentsWithLinks";

const ShipmentsDashboard = () => {
  const navigate = useNavigate();
  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ["shipments-dashboard"],
    queryFn: fetchShipmentsWithLinks,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-4 text-center">Loading shipments...</div>}
        {error && <div className="text-red-500 py-4 text-center">Error loading shipments</div>}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>RFQ</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Shipping Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(shipments.length === 0 && !isLoading) ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment: any) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.id}</TableCell>
                    <TableCell>
                      {shipment.rfq_id ? (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/rfqs/${shipment.rfq_id}`)}
                        >
                          {shipment.rfq_number ?? shipment.rfq_id}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {shipment.quote_id ? (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/quotes/${shipment.quote_id}`)}
                        >
                          {shipment.quote_number ?? shipment.quote_id}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {shipment.order_id ? (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/orders/${shipment.order_id}`)}
                        >
                          {shipment.order_number ?? shipment.order_id}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {shipment.invoice_id ? (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/invoices/${shipment.invoice_id}`)}
                        >
                          {shipment.invoice_number ?? shipment.invoice_id}
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {shipment.eta
                        ? new Date(shipment.eta).toLocaleDateString()
                        : (shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : "-")}
                    </TableCell>
                    <TableCell>
                      {/* Placeholder for shipping documents, could become a dialog for upload/download */}
                      <span className="text-gray-500 italic">Coming soon</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentsDashboard;

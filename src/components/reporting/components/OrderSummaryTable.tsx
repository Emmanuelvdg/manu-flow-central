import React, { useState, useMemo } from "react";
import { OrderSummaryRow } from "@/types/orderSummary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { InlineEditCell } from "./order-summary/InlineEditCell";
import { ContainerDropdown } from "./order-summary/ContainerDropdown";
import { DatePickerCell } from "./order-summary/DatePickerCell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";

interface OrderSummaryTableProps {
  data: OrderSummaryRow[];
  onUpdate: (orderId: string, field: string, value: any) => void;
}

export const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  data,
  onUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const search = searchTerm.toLowerCase();
    return data.filter(
      (row) =>
        row.orderNumber.toLowerCase().includes(search) ||
        row.buyer.toLowerCase().includes(search) ||
        row.country.toLowerCase().includes(search) ||
        row.port?.toLowerCase().includes(search)
    );
  }, [data, searchTerm]);

  const handleExport = () => {
    const exportData = filteredData.map((row) => ({
      Month: row.month,
      "Order No": row.orderNumber,
      Buyer: row.buyer,
      Container: row.containerType || "",
      Consol: row.consol || "",
      "Forecast Load": row.forecastLoadDate ? row.forecastLoadDate.toLocaleDateString() : "",
      Incoterms: row.incoterms || "",
      QC: row.qc || "",
      PIC: row.pic || "",
      Notes: row.notes || "",
      Country: row.country,
      Port: row.port || "",
      "Total Order Value": row.totalOrderValue,
      "Amount Paid to Date": row.amountPaidToDate,
      Currency: row.currency,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Summary");
    XLSX.writeFile(wb, `order-summary-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number, buyer, country, or port..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[80px]">Month</TableHead>
              <TableHead className="w-[100px]">Order No</TableHead>
              <TableHead className="w-[150px]">Buyer</TableHead>
              <TableHead className="w-[120px]">Container</TableHead>
              <TableHead className="w-[100px]">Consol</TableHead>
              <TableHead className="w-[140px]">Forecast Load</TableHead>
              <TableHead className="w-[140px]">TGL Loading</TableHead>
              <TableHead className="w-[100px]">Incoterms</TableHead>
              <TableHead className="w-[120px]">QC</TableHead>
              <TableHead className="w-[120px]">PIC</TableHead>
              <TableHead className="w-[200px]">Notes</TableHead>
              <TableHead className="w-[120px]">Country</TableHead>
              <TableHead className="w-[150px]">Port</TableHead>
              <TableHead className="w-[130px]">Total Value</TableHead>
              <TableHead className="w-[130px]">Paid</TableHead>
              <TableHead className="w-[80px]">Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.orderId}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell>{row.orderNumber}</TableCell>
                <TableCell>{row.buyer}</TableCell>
                <TableCell>
                  <ContainerDropdown
                    value={row.containerType}
                    onSave={(value) => onUpdate(row.orderId, "container_type", value || null)}
                  />
                </TableCell>
                <TableCell>
                  <InlineEditCell
                    value={row.consol}
                    type="number"
                    decimalPlaces={2}
                    onSave={(value) => onUpdate(row.orderId, "consol", value ? parseFloat(value) : null)}
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <DatePickerCell
                    value={row.forecastLoadDate}
                    onSave={(date) => onUpdate(row.orderId, "forecast_load_date", date)}
                  />
                </TableCell>
                <TableCell>
                  <DatePickerCell
                    value={row.tglLoadingDate}
                    onSave={(date) => onUpdate(row.orderId, "tgl_loading_date", date)}
                  />
                </TableCell>
                <TableCell>{row.incoterms || "-"}</TableCell>
                <TableCell>
                  <InlineEditCell
                    value={row.qc}
                    onSave={(value) => onUpdate(row.orderId, "qc", value)}
                  />
                </TableCell>
                <TableCell>
                  <InlineEditCell
                    value={row.pic}
                    onSave={(value) => onUpdate(row.orderId, "pic", value)}
                  />
                </TableCell>
                <TableCell>
                  <InlineEditCell
                    value={row.notes}
                    onSave={(value) => onUpdate(row.orderId, "notes", value)}
                    maxLength={500}
                  />
                </TableCell>
                <TableCell>{row.country || "-"}</TableCell>
                <TableCell>
                  <InlineEditCell
                    value={row.port}
                    onSave={(value) => onUpdate(row.orderId, "port", value)}
                  />
                </TableCell>
                <TableCell>
                  <CurrencyDisplay amount={row.totalOrderValue} currency={row.currency} />
                </TableCell>
                <TableCell>
                  <CurrencyDisplay amount={row.amountPaidToDate} currency={row.currency} />
                </TableCell>
                <TableCell>{row.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No orders found matching your search criteria
        </div>
      )}
    </div>
  );
};

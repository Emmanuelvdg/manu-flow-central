import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrdersOnHandReportRow } from "@/types/ordersOnHand";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import * as XLSX from "xlsx";

interface OrdersOnHandTableProps {
  data: OrdersOnHandReportRow[];
}

export const OrdersOnHandTable: React.FC<OrdersOnHandTableProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof OrdersOnHandReportRow>("materialName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof OrdersOnHandReportRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = data
    .filter((row) =>
      row.materialName.toLowerCase().includes(search.toLowerCase()) ||
      row.category.toLowerCase().includes(search.toLowerCase()) ||
      row.vendor.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toFixed(2);
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    const variants = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    };
    return (
      <Badge variant={variants[risk] as any}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const handleExport = () => {
    const exportData = filteredData.map((row) => ({
      "Material": row.materialName,
      "Category": row.category,
      "Unit": row.unit,
      "Vendor": row.vendor,
      "On Hand Qty": row.onHandQuantity,
      "On Hand Value": row.onHandValue,
      "On Order Qty": row.onOrderQuantity,
      "On Order Value": row.onOrderValue,
      "Allocated Qty": row.allocatedQuantity,
      "Available Qty": row.availableQuantity,
      "Total Qty": row.totalQuantity,
      "Total Value": row.totalValue,
      "Days Supply": row.daysOfSupply,
      "Risk Level": row.stockoutRisk,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders on Hand");
    XLSX.writeFile(wb, "orders-on-hand-report.xlsx");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detailed Inventory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("materialName")}>
                  Material {sortField === "materialName" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                  Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("onHandQuantity")}>
                  On Hand {sortField === "onHandQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("onHandValue")}>
                  On Hand $ {sortField === "onHandValue" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("onOrderQuantity")}>
                  On Order {sortField === "onOrderQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("allocatedQuantity")}>
                  Allocated {sortField === "allocatedQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("availableQuantity")}>
                  Available {sortField === "availableQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("totalValue")}>
                  Total $ {sortField === "totalValue" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("daysOfSupply")}>
                  Days Supply {sortField === "daysOfSupply" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("stockoutRisk")}>
                  Risk {sortField === "stockoutRisk" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground">
                    No materials found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.materialId}>
                    <TableCell className="font-medium">{row.materialName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.category}</Badge>
                    </TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.onHandQuantity)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.onHandValue)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.onOrderQuantity)}</TableCell>
                    <TableCell className="text-right">{formatNumber(row.allocatedQuantity)}</TableCell>
                    <TableCell className={`text-right ${row.availableQuantity < 0 ? 'text-red-600' : ''}`}>
                      {formatNumber(row.availableQuantity)}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.totalValue)}</TableCell>
                    <TableCell className="text-right">{row.daysOfSupply}</TableCell>
                    <TableCell>{getRiskBadge(row.stockoutRisk)}</TableCell>
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


import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { ProductMarginData } from "../hooks/useFinancialData";
import { ChevronRight, Database, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductMarginTableProps {
  data: ProductMarginData[];
}

export const ProductMarginTable: React.FC<ProductMarginTableProps> = ({ data }) => {
  // Table state for search and pagination
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    return data.filter(item => 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);
  
  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);
  
  // Calculate pagination details
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Gross margin columns
  const marginColumns: Column<any>[] = [
    {
      header: "Product",
      accessorKey: "productName",
    },
    {
      header: "Orders",
      accessorKey: "orderCount",
    },
    {
      header: "Revenue",
      accessorKey: "totalRevenue",
      cell: (props) => formatCurrency(props.getValue())
    },
    {
      header: "Cost",
      accessorKey: "totalCost",
      cell: (props) => formatCurrency(props.getValue())
    },
    {
      header: "Gross Margin",
      accessorKey: "totalGrossMargin",
      cell: (props) => formatCurrency(props.getValue())
    },
    {
      header: "Margin %",
      accessorKey: "averageGrossMarginPercentage",
      cell: (props) => {
        const value = props.getValue();
        const color = value >= 30 ? 'text-green-600' : value >= 15 ? 'text-amber-600' : 'text-red-600';
        return <span className={color}>{value.toFixed(1)}%</span>;
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Database className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle>Product Gross Margin Analysis</CardTitle>
        </div>
        <CardDescription>Financial breakdown by product line</CardDescription>
        
        {/* Add search input */}
        <div className="mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {data.length === 0 
              ? "No product margin data available for the selected time period" 
              : "No products found matching your search criteria"}
          </div>
        ) : (
          <>
            <DataTable
              columns={marginColumns}
              data={paginatedData}
            />
            
            {/* Pagination UI */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {/* Generate page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic for showing relevant page numbers
                    let pageNum;
                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Show pages 1-4 + ellipsis
                      pageNum = i < 4 ? i + 1 : null;
                    } else if (currentPage >= totalPages - 2) {
                      // Show last 4 pages + ellipsis
                      pageNum = i < 4 ? totalPages - 3 + i : null;
                    } else {
                      // Show currentPage-1, currentPage, currentPage+1
                      pageNum = i === 0 ? 1 : 
                               i === 1 ? null :
                               i === 2 ? currentPage - 1 :
                               i === 3 ? currentPage :
                               i === 4 ? currentPage + 1 : null;
                    }
                    
                    if (pageNum === null) {
                      return (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            
            <div className="text-xs text-right mt-2 text-muted-foreground">
              Showing {paginatedData.length} of {filteredData.length} products
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

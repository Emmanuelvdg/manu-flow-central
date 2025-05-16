
import React from "react";
import { useFinancialData } from "./hooks/useFinancialData";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";
import { FinancialKPICards } from "./components/FinancialKPICards";
import { GrossMarginChart } from "./components/GrossMarginChart";
import { AgingChart } from "./components/AgingChart";
import { ProductMarginTable } from "./components/ProductMarginTable";
import { toast } from "sonner";

interface FinancialReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ dateRange }) => {
  // Fetch financial data using the hook
  const { data, isLoading, error } = useFinancialData(dateRange);

  // Log error state
  React.useEffect(() => {
    if (error) {
      console.error("Financial report query error:", error);
      toast.error("Failed to load financial report");
    }
  }, [error]);

  // Log data when it changes
  React.useEffect(() => {
    console.log("Financial data loaded:", data);
  }, [data]);

  if (isLoading) {
    return <LoadingState message="Loading financial analysis..." />;
  }

  if (error) {
    console.error("Error loading financial data:", error);
    return <div className="text-center p-4 text-red-500">Error loading financial data. Check console for details.</div>;
  }

  if (!data) {
    console.log("No financial data available");
    return <div className="text-center p-4">No financial data available for the selected time period.</div>;
  }
  
  const { grossMarginByProduct, agingData } = data;
  
  console.log("Rendering financial report with data:", {
    grossMarginByProductCount: grossMarginByProduct.length,
    agingDataCount: agingData.length,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Financial Performance</h2>
      
      <FinancialKPICards data={data} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <GrossMarginChart data={grossMarginByProduct} />
        <AgingChart data={agingData} />
      </div>
      
      <ProductMarginTable data={grossMarginByProduct} />
    </div>
  );
};

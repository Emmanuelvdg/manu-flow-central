
import React from "react";
import { useFinancialData } from "./hooks/useFinancialData";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";
import { ErrorState } from "@/pages/quote-detail/components/ErrorState";
import { FinancialKPICards } from "./components/FinancialKPICards";
import { GrossMarginChart } from "./components/GrossMarginChart";
import { AgingChart } from "./components/AgingChart";
import { ProductMarginTable } from "./components/ProductMarginTable";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinancialReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ dateRange }) => {
  const isMobile = useIsMobile();
  // Fetch financial data using the hook with improved error handling
  const { data, isLoading, error, isError, refetch } = useFinancialData(dateRange);

  // Log data when it changes
  React.useEffect(() => {
    if (data) {
      console.log("Financial data loaded for component rendering:", {
        dataPresent: !!data,
        totalOrders: data.totalOrders,
        productCount: data.grossMarginByProduct.length,
        agingBuckets: data.agingData.length
      });
    }
  }, [data]);

  if (isLoading) {
    return <LoadingState message="Loading financial analysis..." />;
  }

  if (isError || !data) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return (
      <ErrorState 
        message="Unable to load financial data" 
        error={errorMessage}
      />
    );
  }
  
  const { grossMarginByProduct, agingData } = data;

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <h2 className="text-xl font-bold px-2 sm:px-0">Financial Performance</h2>
      
      {/* Financial KPIs */}
      <div className="px-2 sm:px-0 w-full">
        <FinancialKPICards data={data} />
      </div>
      
      {/* Charts */}
      <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} w-full`}>
        <GrossMarginChart data={grossMarginByProduct} />
        <AgingChart data={agingData} />
      </div>
      
      {/* Detailed margin table with pagination */}
      <div className="px-2 sm:px-0 w-full overflow-x-auto">
        <ProductMarginTable data={grossMarginByProduct} />
      </div>
    </div>
  );
};


import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { QuoteOrderMapping } from "@/components/dashboard/quotes/QuoteOrderMapping";

const QuoteOrderMappingPage = () => {
  return (
    <MainLayout title="Quote to Order Mapping">
      <Card>
        <QuoteOrderMapping />
      </Card>
    </MainLayout>
  );
};

export default QuoteOrderMappingPage;


import React from "react";
import { QuoteDetailForm } from "./QuoteDetailForm";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout title="Quote Details">
      <QuoteDetailForm quoteId={id} />
    </MainLayout>
  );
};

export default QuoteDetail;

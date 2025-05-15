
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { QuoteDetailForm } from "./QuoteDetailForm";
import { useParams } from "react-router-dom";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout title={id ? `Quote ${id}` : "New Quote"}>
      <QuoteDetailForm quoteId={id} />
    </MainLayout>
  );
};

export default QuoteDetail;

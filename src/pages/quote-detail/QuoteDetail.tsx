
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "@/components/dashboard/quotes/quoteUtils";
import { QuoteDetailForm } from "./QuoteDetailForm";
import { QuoteAnalytics } from "./components/analytics/QuoteAnalytics";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => fetchQuote(id!),
    enabled: !!id,
  });

  return (
    <MainLayout title={isLoading ? "Loading Quote..." : `Quote ${quote?.quote_number || id}`}>
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <LoadingState message="Loading quote details..." />
          ) : error ? (
            <ErrorState message="Failed to load quote details" />
          ) : id === "create" || !quote ? (
            <QuoteDetailForm isNew={true} />
          ) : (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Quote Details</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <QuoteDetailForm initialData={quote} />
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <QuoteAnalytics quote={quote} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default QuoteDetail;


import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QuoteDetailForm } from "./QuoteDetailForm";
import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "@/components/dashboard/quotes/quoteUtils";

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Skip fetching for new quotes
  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => fetchQuote(id || ''),
    enabled: !!id && id !== 'create',
  });

  return (
    <MainLayout title={`Quote Detail${id ? ` - ${id}` : ""}`}>
      <div className="max-w-2xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/quotes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Link>
        </Button>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>
              {id && id !== "create" ? `Quote #${quote?.quote_number || id}` : "Create Quote"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading quote details...</div>
            ) : (
              <QuoteDetailForm initialData={quote} />
            )}
          </CardContent>
          {/* Footer handled in form for precise enable/disable behaviour */}
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuoteDetail;

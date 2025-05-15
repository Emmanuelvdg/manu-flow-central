
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { QuoteDetailsHeader } from "./components/QuoteDetailsHeader";
import { QuoteCustomer } from "./components/QuoteCustomer";
import { QuoteProducts } from "./components/QuoteProducts";
import { QuoteActions } from "@/components/dashboard/quotes/QuoteActions";
import { QuoteTerms } from "./components/QuoteTerms";
import { CustomProductsList } from "./components/custom-product/CustomProductsList";
import { Quote } from "@/components/dashboard/quotes/types/quoteTypes";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Fetch quote data
  const { 
    data: quote, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error fetching quote",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Quote;
    },
    enabled: !!id
  });

  // Status change handler
  const handleStatusChange = () => {
    refetch();
  };

  if (isLoading) {
    return <MainLayout title="Quote Details"><LoadingState /></MainLayout>;
  }

  if (error || !quote) {
    return (
      <MainLayout title="Quote Details">
        <ErrorState 
          message="Failed to load quote details. Please try again." 
          error={error instanceof Error ? error.message : "Unknown error"}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Quote #${quote.quote_number}`}>
      <div className="space-y-6">
        <QuoteDetailsHeader
          quoteNumber={quote.quote_number}
          status={quote.status}
          createdAt={quote.created_at}
          riskLevel={quote.risk_level}
          onStatusChange={handleStatusChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <QuoteProducts products={quote.products} />
              
              {/* If this quote has custom products */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Custom Products</h3>
                <CustomProductsList quoteId={quote.id} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <QuoteCustomer
                  customerName={quote.customer_name}
                  customerEmail={quote.customer_email}
                  companyName={quote.company_name}
                />

                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Amount:</span>
                    <span className="font-medium">{quote.currency} {quote.total.toFixed(2)}</span>
                  </div>
                  {quote.deposit_percentage && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Deposit Required:</span>
                      <span className="font-medium">{quote.deposit_percentage}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
                <QuoteTerms 
                  paymentTerms={quote.payment_terms}
                  shippingMethod={quote.shipping_method}
                  incoterms={quote.incoterms}
                  estimatedDelivery={quote.estimated_delivery}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <QuoteActions 
                quoteId={quote.id} 
                status={quote.status}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QuoteDetail;

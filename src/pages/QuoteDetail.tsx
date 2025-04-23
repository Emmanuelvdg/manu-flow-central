import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { calculateRisk, getRecommendedDeposit } from "@/utils/riskCalculator";
import { QuoteCustomerFields } from "./QuoteCustomerFields";
import { QuoteProductsSection, RFQProductItem } from "./QuoteProductsSection";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchQuote } from "@/components/dashboard/quotes/quoteUtils";

interface FromRFQ {
  rfqId: string;
  customerName: string;
  products?: any;
  contact?: string;
  location?: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  notes?: string;
}

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const fromRFQ: FromRFQ | undefined = location.state?.fromRFQ;
  const onQuoteCreated: ((quoteId: string) => void) | undefined = (location.state as any)?.onQuoteCreated;

  const [customerName, setCustomerName] = useState<string>(fromRFQ?.customerName ?? "");
  const [customerEmail, setCustomerEmail] = useState<string>(fromRFQ?.customerEmail ?? "");
  const [customerPhone, setCustomerPhone] = useState<string>(fromRFQ?.customerPhone ?? "");
  const [companyName, setCompanyName] = useState<string>(fromRFQ?.companyName ?? "");
  const [notes, setNotes] = useState<string>(fromRFQ?.notes ?? "");

  const [rfqProducts, setRFQProducts] = useState<RFQProductItem[] | undefined>(
    fromRFQ?.products && Array.isArray(fromRFQ.products)
      ? fromRFQ.products.map((p: any) => ({
          id: p.id ?? undefined,
          name: p.name ?? String(p),
          quantity: p.quantity ?? 1,
        }))
      : undefined
  );
  const [products, setProducts] = useState<string>(
    !fromRFQ?.products
      ? ""
      : Array.isArray(fromRFQ.products)
        ? fromRFQ.products.map((prod: any) => prod.name || prod).join(", ")
        : String(fromRFQ.products)
  );
  const [currency, setCurrency] = useState<string>("USD");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [top, setTop] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [incoterm, setIncoterm] = useState<string>("");
  const [risk, setRisk] = useState<string>("");
  const [recommendedDeposit, setRecommendedDeposit] = useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number | undefined>(undefined);
  const [locationField, setLocationField] = useState<string>(fromRFQ?.location ?? "");
  const [status, setStatus] = useState<string>("submitted");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id && id !== 'create') {
      setIsLoading(true);
      fetchQuote(id)
        .then((quoteData) => {
          if (quoteData) {
            setCustomerName(quoteData.customer_name || "");
            setCustomerEmail(quoteData.customer_email || "");
            setCompanyName(quoteData.company_name || "");
            setCurrency(quoteData.currency || "USD");
            setTotalAmount(quoteData.total || 0);
            setPaymentTerm(quoteData.payment_terms || "");
            setShippingMethod(quoteData.shipping_method || "");
            setIncoterm(quoteData.incoterms || "");
            setRisk(quoteData.risk_level || "");
            setDepositPercentage(quoteData.deposit_percentage);
            setStatus(quoteData.status || "submitted");
            
            if (quoteData.products) {
              if (Array.isArray(quoteData.products)) {
                setRFQProducts(quoteData.products.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  quantity: p.quantity || 1
                })));
              } else {
                setProducts(String(quoteData.products));
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error loading quote:", error);
          toast({
            title: "Error",
            description: "Failed to load quote data",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (fromRFQ) {
      setCustomerName(fromRFQ.customerName ?? "");
      setCustomerEmail(fromRFQ.customerEmail ?? "");
      setCustomerPhone(fromRFQ.customerPhone ?? "");
      setCompanyName(fromRFQ.companyName ?? "");
      setNotes(fromRFQ.notes ?? "");
      setRFQProducts(
        fromRFQ.products && Array.isArray(fromRFQ.products)
          ? fromRFQ.products.map((p: any) => ({
              id: p.id ?? undefined,
              name: p.name ?? String(p),
              quantity: p.quantity ?? 1,
            }))
          : undefined
      );
      setProducts(
        !fromRFQ.products
          ? ""
          : Array.isArray(fromRFQ.products)
            ? fromRFQ.products.map((prod: any) => prod.name || prod).join(", ")
            : String(fromRFQ.products)
      );
      setLocationField(fromRFQ.location ?? "");
    }
  }, [fromRFQ]);

  useEffect(() => {
    const calculatedRisk = calculateRisk(
      incoterm as 'cif' | 'ddp' | 'fob' | 'exw' | '', 
      paymentTerm as 'advance' | 'lc' | 'open' | ''
    );
    setRisk(calculatedRisk);
    const recommendedDepositValue = getRecommendedDeposit(calculatedRisk);
    setRecommendedDeposit(recommendedDepositValue);
  }, [incoterm, paymentTerm]);

  const createShipmentIfNeeded = async (rfqId: string, quoteId: string) => {
    if (typeof onQuoteCreated === "function") {
      await onQuoteCreated(quoteId);
    } else {
      const { data: shipments } = await supabase
        .from('shipments')
        .select('id')
        .eq('rfq_id', rfqId)
        .eq('quote_id', quoteId);
      if (!shipments || shipments.length === 0) {
        await supabase.from('shipments').insert({
          rfq_id: rfqId,
          quote_id: quoteId,
          status: 'pending'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive"
      });
      return;
    }

    if (totalAmount <= 0) {
      toast({
        title: "Error",
        description: "Total amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let productsData;
      if (rfqProducts && Array.isArray(rfqProducts)) {
        productsData = rfqProducts.map(p => ({
          name: p.name,
          quantity: p.quantity || 1
        }));
      } else if (products) {
        productsData = products.split(',').map(p => ({ 
          name: p.trim(),
          quantity: 1
        }));
      } else {
        productsData = [];
      }

      const quoteNumber = id ? undefined : `Q-${Date.now()}`;

      const quoteData = {
        ...(quoteNumber && { quote_number: quoteNumber }),
        rfq_id: fromRFQ?.rfqId,
        customer_name: customerName,
        customer_email: customerEmail,
        company_name: companyName,
        products: productsData,
        total: totalAmount,
        currency,
        payment_terms: paymentTerm,
        shipping_method: shippingMethod,
        incoterms: incoterm,
        risk_level: risk,
        deposit_percentage: depositPercentage,
        status
      };

      let result;
      
      if (id && id !== 'create') {
        result = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', id);
          
        if (result.error) {
          throw result.error;
        }
        
        toast({
          title: "Success",
          description: "Quote updated successfully",
        });
      } else {
        result = await supabase
          .from('quotes')
          .insert(quoteData)
          .select('id')
          .single();
          
        if (result.error) {
          throw result.error;
        }

        const newQuoteId = result.data.id as string;
        if (fromRFQ?.rfqId && newQuoteId) {
          const { error: rfqError } = await supabase
            .from('rfqs')
            .update({ status: 'quoted' })
            .eq('id', fromRFQ.rfqId);
          if (rfqError) {
            console.error("Error updating RFQ status:", rfqError);
          }
          await createShipmentIfNeeded(fromRFQ.rfqId, newQuoteId);
        }
        
        toast({
          title: "Success",
          description: "Quote saved successfully",
        });

        navigate('/quotes');
      }
    } catch (error: any) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save quote",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {isLoading ? "Loading..." : (id && id !== 'create' ? `Quote #${id}` : "Create Quote")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Loading quote data...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <QuoteCustomerFields
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  customerEmail={customerEmail}
                  setCustomerEmail={setCustomerEmail}
                  customerPhone={customerPhone}
                  setCustomerPhone={setCustomerPhone}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  locationField={locationField}
                  setLocationField={setLocationField}
                  notes={notes}
                  setNotes={setNotes}
                />
                <QuoteProductsSection
                  rfqProducts={rfqProducts}
                  setRFQProducts={setRFQProducts}
                  products={products}
                  setProducts={setProducts}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Total Amount</label>
                    <input 
                      type="number" 
                      className="w-full rounded border p-2" 
                      placeholder="Total" 
                      value={totalAmount || ''} 
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="IDR">IDR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Terms of Payment (Days)</label>
                  <Select value={top} onValueChange={setTop}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="7">+7</SelectItem>
                      <SelectItem value="14">+14</SelectItem>
                      <SelectItem value="30">+30</SelectItem>
                      <SelectItem value="60">+60</SelectItem>
                      <SelectItem value="90">+90</SelectItem>
                      <SelectItem value="120">+120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Method</label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_collect">Self Collect</SelectItem>
                      <SelectItem value="sea">Sea</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms</label>
                  <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">Advance Payment</SelectItem>
                      <SelectItem value="lc">Letter of Credit</SelectItem>
                      <SelectItem value="open">Open Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Incoterms</label>
                  <Select value={incoterm} onValueChange={setIncoterm}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select incoterms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cif">CIF</SelectItem>
                      <SelectItem value="ddp">DDP</SelectItem>
                      <SelectItem value="fob">FOB</SelectItem>
                      <SelectItem value="exw">EXW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Risk Level</label>
                  <input 
                    type="text" 
                    className="w-full rounded border p-2 bg-gray-50" 
                    value={risk} 
                    readOnly 
                    placeholder="Select Incoterms and Payment Terms to calculate risk"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deposit Required (%) 
                    {recommendedDeposit > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        Recommended: {recommendedDeposit}%
                      </span>
                    )}
                  </label>
                  <input 
                    type="number" 
                    className="w-full rounded border p-2" 
                    placeholder="Enter deposit percentage"
                    min="0"
                    max="100"
                    value={depositPercentage ?? ''}
                    onChange={(e) => setDepositPercentage(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="button" 
              className="ml-auto" 
              onClick={handleSubmit} 
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Saving..." : (id && id !== 'create' ? "Update Quote" : "Save Quote")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuoteDetail;


import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { calculateRisk, getRecommendedDeposit } from "@/utils/riskCalculator";
import { QuoteCustomerFields } from "./QuoteCustomerFields";
import { QuoteProductsSection, RFQProductItem } from "./QuoteProductsSection";

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
  const fromRFQ: FromRFQ | undefined = location.state?.fromRFQ;

  // New: fields for customer/contact/company/email/phone/notes if present
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
  const [currency, setCurrency] = useState<string>("");
  const [top, setTop] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [paymentTerm, setPaymentTerm] = useState<string>("");
  const [incoterm, setIncoterm] = useState<string>("");
  const [risk, setRisk] = useState<string>("");
  const [recommendedDeposit, setRecommendedDeposit] = useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number | undefined>(undefined);
  const [locationField, setLocationField] = useState<string>(fromRFQ?.location ?? "");

  // Autofill on navigation for /quotes/create
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
              {id ? `Quote #${id}` : "Create Quote"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {/* Customer/Company/Email/Phone/Location/Notes */}
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
              {/* Products Section - supports list mode with quantities or fallback to free text */}
              <QuoteProductsSection
                rfqProducts={rfqProducts}
                setRFQProducts={setRFQProducts}
                products={products}
                setProducts={setProducts}
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Total Amount</label>
                  <input type="number" className="w-full rounded border p-2" placeholder="Total" />
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
                <Select>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save Quote</Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuoteDetail;

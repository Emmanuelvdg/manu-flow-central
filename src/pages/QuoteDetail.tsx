import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { calculateRisk, getRecommendedDeposit } from "@/utils/riskCalculator";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [incoterm, setIncoterm] = useState<string>('');
  const [paymentTerm, setPaymentTerm] = useState<string>('');
  const [risk, setRisk] = useState<string>('');
  const [recommendedDeposit, setRecommendedDeposit] = useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number | undefined>(undefined);

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
    <MainLayout title={`Quote Detail - ${id}`}>
      <div className="max-w-2xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/quotes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Link>
        </Button>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Quote #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input type="text" className="w-full rounded border p-2" placeholder="Customer Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Products</label>
                <input type="text" className="w-full rounded border p-2" placeholder="Products" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <input type="number" className="w-full rounded border p-2" placeholder="Total" />
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

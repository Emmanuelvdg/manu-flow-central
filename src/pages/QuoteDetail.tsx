
import React from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const QuoteDetail = () => {
  const { id } = useParams<{ id: string }>();

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
                <Select>
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
                <Select>
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
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full rounded border p-2">
                  <option>Submitted</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
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

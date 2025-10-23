import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";

const InvoiceInsurance = () => {
  return (
    <MainLayout title="Invoice Insurance">
      <div className="space-y-6">
        {/* Eligibility Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              <CardTitle>Eligibility</CardTitle>
            </div>
            <CardDescription>
              Requirements for Invoice Insurance coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-right">
              <li>Business must be operational for at least 12 months</li>
              <li>Annual revenue exceeding $100,000</li>
              <li>Valid invoices for goods or services delivered</li>
              <li>Customers with verifiable credit history</li>
              <li>No bankruptcy filings in the past 5 years</li>
            </ul>
          </CardContent>
        </Card>

        {/* How it Works Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>How It Works</CardTitle>
            </div>
            <CardDescription>
              Understanding the Invoice Insurance process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Submit Application</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the application form with your business and invoice details
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Credit Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    We evaluate your customer's creditworthiness and invoice validity
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Policy Activation</h4>
                  <p className="text-sm text-muted-foreground">
                    Upon approval, your invoice is covered against non-payment
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Protection & Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    If customer defaults, we cover up to 90% of the invoice value
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apply Here Section */}
        <Card>
          <CardHeader>
            <CardTitle>Apply Here</CardTitle>
            <CardDescription>
              Start your Invoice Insurance application today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ready to protect your business from invoice non-payment? Our team will review your application within 24-48 hours.
            </p>
            <div className="flex gap-4">
              <Button size="lg">
                Start Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InvoiceInsurance;

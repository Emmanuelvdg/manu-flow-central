import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, ArrowRight } from "lucide-react";
import { InternationalFinancingApplicationDialog } from "./components/InternationalFinancingApplicationDialog";

const InternationalFinancing = () => {
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  return (
    <MainLayout title="International Financing">
      <div className="space-y-6">
        {/* Eligibility Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              <CardTitle>Eligibility</CardTitle>
            </div>
            <CardDescription>
              Requirements for International Financing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>Established international trade history (minimum 12 months)</li>
              <li>Annual export/import revenue exceeding $200,000</li>
              <li>Valid international purchase orders or letters of credit</li>
              <li>Compliance with international trade regulations</li>
              <li>Strong relationship with overseas buyers/suppliers</li>
              <li>Currency risk management strategy in place</li>
            </ul>
          </CardContent>
        </Card>

        {/* How it Works Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <CardTitle>How It Works</CardTitle>
            </div>
            <CardDescription>
              Understanding the International Financing process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Application & Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit application with international trade documents and contracts
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Trade & Risk Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    We evaluate country risk, buyer creditworthiness, and currency exposure
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Structured Financing</h4>
                  <p className="text-sm text-muted-foreground">
                    Customized financing solution with trade insurance and FX hedging
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fund Release & Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Funds disbursed with ongoing trade finance support and documentation
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
              Start your International Financing application today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Expand your global business with confidence. Our international financing solutions provide the capital and risk protection you need for cross-border trade.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setApplicationDialogOpen(true)}>
                Start Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Speak with Trade Specialist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <InternationalFinancingApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </MainLayout>
  );
};

export default InternationalFinancing;

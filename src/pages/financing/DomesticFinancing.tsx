import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { DomesticFinancingApplicationDialog } from "./components/DomesticFinancingApplicationDialog";

const DomesticFinancing = () => {
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  return (
    <MainLayout title="Domestic Financing">
      <div className="space-y-6">
        {/* Eligibility Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              <CardTitle>Eligibility</CardTitle>
            </div>
            <CardDescription>
              Requirements for Domestic Financing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>Registered business entity in the country</li>
              <li>Minimum 6 months of operational history</li>
              <li>Annual revenue of at least $50,000</li>
              <li>Valid purchase orders or contracts</li>
              <li>Positive credit score and financial history</li>
              <li>No active bankruptcies or liens</li>
            </ul>
          </CardContent>
        </Card>

        {/* How it Works Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <CardTitle>How It Works</CardTitle>
            </div>
            <CardDescription>
              Understanding the Domestic Financing process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Application Submission</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit your financing request with business and order details
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Financial Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team evaluates your financial standing and funding needs
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Approval & Terms</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive approval with competitive rates and flexible repayment terms
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Fund Disbursement</h4>
                  <p className="text-sm text-muted-foreground">
                    Funds are transferred directly to your account within 3-5 business days
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
              Start your Domestic Financing application today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get the working capital you need to grow your business. Our domestic financing solutions offer competitive rates and fast approval.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setApplicationDialogOpen(true)}>
                Start Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DomesticFinancingApplicationDialog 
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </MainLayout>
  );
};

export default DomesticFinancing;

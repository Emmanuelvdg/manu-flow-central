
import React from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const RFQDetail = () => {
  const { id } = useParams<{ id: string }>();
  // Placeholder data
  return (
    <MainLayout title={`RFQ Detail - ${id}`}>
      <div className="max-w-2xl mx-auto mt-8">
        <Button variant="outline" size="sm" asChild>
          <Link to="/rfqs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFQs
          </Link>
        </Button>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>RFQ #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input type="text" className="w-full rounded border p-2" placeholder="Customer Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" className="w-full rounded border p-2" placeholder="Contact Email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" className="w-full rounded border p-2" placeholder="Delivery Location" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product(s)</label>
                <textarea className="w-full rounded border p-2" placeholder="Products requested..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full rounded border p-2">
                  <option>Draft</option>
                  <option>Submitted</option>
                  <option>Processed</option>
                </select>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save RFQ</Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RFQDetail;

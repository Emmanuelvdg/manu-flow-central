
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QuoteDetailForm } from "./QuoteDetailForm";

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
              {id && id !== "create" ? `Quote #${id}` : "Create Quote"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteDetailForm />
          </CardContent>
          {/* Footer handled in form for precise enable/disable behaviour */}
        </Card>
      </div>
    </MainLayout>
  );
};

export default QuoteDetail;

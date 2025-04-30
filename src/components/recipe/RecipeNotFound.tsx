
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipeNotFoundProps {
  id?: string;
}

const RecipeNotFound: React.FC<RecipeNotFoundProps> = ({ id }) => {
  return (
    <div className="space-y-5">
      <Button variant="outline" size="sm" asChild>
        <Link to="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bill of Materials
        </Link>
      </Button>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-amber-500 mb-4 text-6xl">⚠️</div>
            <h2 className="text-2xl font-semibold mb-2">Bill of Materials Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find a BOM for the ID: {id}
            </p>
            <Button asChild>
              <Link to="/recipes">View All BOMs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeNotFound;

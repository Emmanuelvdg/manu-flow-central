
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface LoadingStateProps {
  isLoading: boolean;
  errorMessage: string | null;
  handleRefresh: () => Promise<void>;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  errorMessage,
  handleRefresh
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (errorMessage) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">{errorMessage}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }
  
  return null;
};

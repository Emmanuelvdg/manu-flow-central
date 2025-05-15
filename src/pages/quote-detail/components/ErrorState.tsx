
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  retryAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, retryAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="mt-4 text-sm text-destructive">{message}</p>
      {retryAction && (
        <Button variant="outline" onClick={retryAction} className="mt-4">
          Retry
        </Button>
      )}
    </div>
  );
};

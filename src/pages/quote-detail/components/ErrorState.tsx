
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  message: string;
  error?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  error 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-3xl mx-auto p-8 space-y-6">
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        
        {error && (
          <div className="mt-2 p-2 bg-destructive/20 text-xs font-mono rounded overflow-auto">
            {error}
          </div>
        )}
      </Alert>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
        <Button onClick={() => navigate('/quotes')}>
          Return to Quotes
        </Button>
      </div>
    </div>
  );
};

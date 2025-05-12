
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThankYouPage: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Thank You for Your Request</CardTitle>
        <CardDescription className="text-lg">
          Your quote request has been successfully submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Our team will review your request and get back to you as soon as possible.
          If you have any questions, please feel free to contact us.
        </p>
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
          <ol className="text-left text-gray-600 list-decimal list-inside space-y-2">
            <li>Our team will review your request.</li>
            <li>We'll prepare a customized quote based on your specific needs.</li>
            <li>A representative will contact you to discuss the details.</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Link to="/public">
          <Button>Continue Browsing Products</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

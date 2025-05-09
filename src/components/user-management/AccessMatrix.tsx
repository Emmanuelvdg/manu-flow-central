
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AccessMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">
          The access matrix shows which user groups have permissions to access different resources in the system.
        </p>
        <div className="mt-4">
          {/* Access matrix content will be added here */}
          <p className="py-8 text-center text-muted-foreground">
            Access Matrix functionality is coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

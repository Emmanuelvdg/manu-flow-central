
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const MaterialsLoadingState = () => {
  return (
    <Card>
      <div className="p-6 border-b">
        <Skeleton className="h-8 w-48" />
      </div>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

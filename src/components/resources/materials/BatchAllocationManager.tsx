
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { allocateAllBookedOrders, checkAllocationStatus } from "@/utils/batchAllocationUtils";

export const BatchAllocationManager: React.FC = () => {
  const { toast } = useToast();
  const [isAllocating, setIsAllocating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [allocationStatus, setAllocationStatus] = useState<{
    allocated: number;
    unallocated: number;
    total: number;
  } | null>(null);
  const [allocationResults, setAllocationResults] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleCheckAllocations = async () => {
    setIsChecking(true);
    try {
      const status = await checkAllocationStatus();
      setAllocationStatus(status);
      toast({
        title: "Allocation Status Check Complete",
        description: `Found ${status.total} booked orders: ${status.allocated} already allocated, ${status.unallocated} unallocated`
      });
    } catch (error) {
      console.error("Error checking allocations:", error);
      toast({
        title: "Error",
        description: "Failed to check allocation status",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleAllocateAll = async () => {
    setIsAllocating(true);
    try {
      const results = await allocateAllBookedOrders();
      setAllocationResults(results);
      toast({
        title: "Batch Allocation Complete",
        description: `Processed ${results.total} orders: ${results.success} successful, ${results.failed} failed`
      });
    } catch (error) {
      console.error("Error in batch allocation:", error);
      toast({
        title: "Batch Allocation Error",
        description: "Failed to complete batch allocation",
        variant: "destructive"
      });
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Batch Material Allocation
        </CardTitle>
        <CardDescription>
          Process all orders with "booked" status to allocate materials from inventory
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {allocationStatus && (
            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Current Allocation Status:</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                  <Badge variant="outline" className="mt-1">{allocationStatus.total}</Badge>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Allocated</span>
                  <Badge variant="secondary" className="mt-1">{allocationStatus.allocated}</Badge>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Unallocated</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 mt-1">{allocationStatus.unallocated}</Badge>
                </div>
              </div>
            </div>
          )}

          {allocationResults && (
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Allocation Results:</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Processed</span>
                  <Badge variant="outline" className="mt-1">{allocationResults.total}</Badge>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Successful</span>
                  <Badge variant="default" className="bg-green-100 text-green-800 mt-1">{allocationResults.success}</Badge>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded shadow-sm">
                  <span className="text-sm text-muted-foreground">Failed</span>
                  <Badge variant={allocationResults.failed > 0 ? "destructive" : "outline"} className="mt-1">
                    {allocationResults.failed}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handleCheckAllocations}
          disabled={isChecking || isAllocating}
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>Check Current Allocations</>
          )}
        </Button>

        <Button 
          variant="default" 
          onClick={handleAllocateAll} 
          disabled={isAllocating || isChecking}
        >
          {isAllocating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Allocating...
            </>
          ) : (
            <>Allocate Materials for All Booked Orders</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

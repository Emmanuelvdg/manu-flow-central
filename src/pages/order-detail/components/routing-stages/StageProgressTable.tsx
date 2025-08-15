import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StageProgressData } from "./hooks/useUnitProgress";

interface StageProgressTableProps {
  stageProgressData: StageProgressData[];
  orderProducts: any[];
}

export const StageProgressTable: React.FC<StageProgressTableProps> = ({
  stageProgressData,
  orderProducts
}) => {
  // Group progress data by order product
  const groupedData = orderProducts.map(orderProduct => {
    const productProgress = stageProgressData.filter(
      p => p.order_product_id === orderProduct.id
    );
    
    return {
      orderProduct,
      stages: productProgress
    };
  });

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getStatusBadge = (completed: number, total: number) => {
    const percentage = getProgressPercentage(completed, total);
    
    if (percentage === 0) {
      return <Badge variant="secondary">Not Started</Badge>;
    } else if (percentage === 100) {
      return <Badge variant="default">Completed</Badge>;
    } else {
      return <Badge variant="outline">In Progress</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {groupedData.map(({ orderProduct, stages }) => (
        <div key={orderProduct.id} className="space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="font-semibold">
              {orderProduct.product_name || `Product ${orderProduct.product_id}`}
            </h4>
            <Badge variant="outline">
              {orderProduct.quantity} units
            </Badge>
          </div>

          {stages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage Name</TableHead>
                  <TableHead className="text-center">Yet to Start</TableHead>
                  <TableHead className="text-center">In Progress</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stages.map((stage) => {
                  const percentage = getProgressPercentage(stage.completed_units, stage.total_units);
                  
                  return (
                    <TableRow key={stage.id}>
                      <TableCell className="font-medium">
                        {stage.stage_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded bg-secondary text-secondary-foreground text-sm">
                          {stage.yet_to_start_units}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded bg-primary/10 text-primary text-sm">
                          {stage.in_progress_units}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded bg-primary text-primary-foreground text-sm">
                          {stage.completed_units}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-sm font-medium min-w-[3rem]">
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(stage.completed_units, stage.total_units)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No routing stages found for this product
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
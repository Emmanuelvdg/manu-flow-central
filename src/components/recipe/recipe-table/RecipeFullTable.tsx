
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecipeStats from "./RecipeStats";
import MaterialsTableRows from "./MaterialsTableRows";
import StageGroupRows from "./StageGroupRows";
import TotalCostRow from "./TotalCostRow";
import RecipeTableFilters, { RecipeFilters } from "./RecipeTableFilters";
import type { RecipeFullTableProps } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  materials,
  routingStages,
  materialCosts = { individualCosts: [], totalCost: 0 }
}) => {
  const [filters, setFilters] = useState<RecipeFilters>({
    materialNameFilter: "",
    minCostThreshold: 0
  });
  
  const [materialsExpanded, setMaterialsExpanded] = useState(true);
  const [routingExpanded, setRoutingExpanded] = useState(true);

  // Determine the maximum cost for the slider
  const maxCost = Math.max(
    ...materialCosts.individualCosts.map(cost => cost.cost), 
    1 // Ensure a minimum of 1 to avoid slider issues
  );

  return (
    <Card className="mt-6 shadow-md">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recipe Breakdown
          </h2>
          <p className="text-sm text-gray-500">
            Complete breakdown of materials and production stages
          </p>
        </div>
        
        <RecipeStats 
          materials={materials} 
          routingStages={routingStages} 
          totalCost={materialCosts.totalCost} 
        />
        
        <div className="mb-6">
          <RecipeTableFilters 
            onFilterChange={setFilters}
            maxPossibleCost={maxCost}
          />
        </div>
        
        {/* Materials Section - Collapsible */}
        <Collapsible 
          open={materialsExpanded} 
          onOpenChange={setMaterialsExpanded}
          className="mb-6 border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left">
            <div className="font-medium flex items-center text-yellow-800">
              Materials List
            </div>
            {materialsExpanded ? 
              <ChevronUp className="h-5 w-5 text-yellow-800" /> : 
              <ChevronDown className="h-5 w-5 text-yellow-800" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Routing Stage</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <MaterialsTableRows 
                    materials={materials} 
                    materialCosts={materialCosts.individualCosts}
                    filters={filters}
                  />
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Routing Stages Section - Collapsible */}
        <Collapsible 
          open={routingExpanded} 
          onOpenChange={setRoutingExpanded}
          className="mb-6 border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-purple-50 hover:bg-purple-100 transition-colors text-left">
            <div className="font-medium flex items-center text-purple-800">
              Production Stages
            </div>
            {routingExpanded ? 
              <ChevronUp className="h-5 w-5 text-purple-800" /> : 
              <ChevronDown className="h-5 w-5 text-purple-800" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Routing Stage</TableHead>
                    <TableHead>Name / Role / Machine</TableHead>
                    <TableHead className="text-center">Qty / Hrs</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routingStages.map((stage) => (
                    <StageGroupRows key={stage.id} stage={stage} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Total Cost Summary */}
        <div className="border rounded-md overflow-hidden shadow-sm">
          <div className="p-3 bg-red-50 font-medium text-red-800">
            Cost Summary
          </div>
          <Table>
            <TableBody>
              <TotalCostRow totalCost={materialCosts.totalCost} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeFullTable;

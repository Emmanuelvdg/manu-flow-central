
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MaterialsTableRows } from "./MaterialsTableRows";
import { TotalCostRow } from "./TotalCostRow";
import { RecipeStats } from "./RecipeStats";
import { StageGroupRows } from "./StageGroupRows";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  RecipeTableProps,
  MaterialCosts,
  Material,
  RoutingStage,
} from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecipeFullTableProps {
  recipe: any;
  materials: Material[];
  routingStages: RoutingStage[];
  materialCosts?: MaterialCosts;
}

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  recipe,
  materials,
  routingStages,
  materialCosts,
}) => {
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Ensure we have valid materials and routingStages arrays
  const safetyMaterials = materials || [];
  const safetyStages = routingStages || [];
  
  // Calculate total cost (materials + labor + machine)
  const materialCost = materialCosts?.totalCost || 0;
  const laborCost = safetyStages.reduce((total, stage) => {
    return (
      total +
      (stage.personnel || []).reduce(
        (stageTotal, person) =>
          stageTotal + (person.hourlyRate || 0) * (person.hours || 0),
        0
      )
    );
  }, 0);
  const machineCost = safetyStages.reduce((total, stage) => {
    return (
      total +
      (stage.machines || []).reduce(
        (stageTotal, machine) =>
          stageTotal + (machine.hourlyRate || 0) * (machine.hours || 0),
        0
      )
    );
  }, 0);
  const totalCost = materialCost + laborCost + machineCost;

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recipe Cost Breakdown</CardTitle>
          <CardDescription>
            Cost analysis for product recipe
          </CardDescription>
        </div>
        <Button variant="outline" onClick={toggleStats} size="sm">
          {showStats ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" /> Hide Stats
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" /> Show Stats
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent>
        {showStats && (
          <RecipeStats 
            quantity={1} 
            showStats={showStats} 
            setShowStats={setShowStats}
            materialCost={materialCost}
            laborCost={laborCost}
            machineCost={machineCost}
            totalCost={totalCost}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Category</th>
                  <th className="text-right py-2 font-medium">Cost</th>
                  <th className="text-right py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Raw Materials</td>
                  <td className="text-right">${materialCost.toFixed(2)}</td>
                  <td className="text-right">
                    {totalCost ? ((materialCost / totalCost) * 100).toFixed(1) : "0"}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Labor</td>
                  <td className="text-right">${laborCost.toFixed(2)}</td>
                  <td className="text-right">
                    {totalCost ? ((laborCost / totalCost) * 100).toFixed(1) : "0"}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Machine Usage</td>
                  <td className="text-right">${machineCost.toFixed(2)}</td>
                  <td className="text-right">
                    {totalCost ? ((machineCost / totalCost) * 100).toFixed(1) : "0"}%
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <TotalCostRow totalCost={totalCost} />
              </tfoot>
            </table>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-6">
              {/* Materials Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Materials</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Material</th>
                      <th className="text-right py-2 font-medium">Quantity</th>
                      <th className="text-right py-2 font-medium">Unit</th>
                      <th className="text-right py-2 font-medium">Unit Cost</th>
                      <th className="text-right py-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safetyMaterials.length > 0 ? (
                      <MaterialsTableRows
                        materials={safetyMaterials}
                        individualCosts={materialCosts?.individualCosts || []}
                      />
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          No materials added to this recipe
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={4} className="py-2 font-medium text-right">
                        Total Materials Cost:
                      </td>
                      <td className="py-2 text-right font-bold">
                        ${materialCost.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Production Stages Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Production Stages</h3>
                {safetyStages.length > 0 ? (
                  <StageGroupRows routingStages={safetyStages} />
                ) : (
                  <div className="text-center py-4 text-gray-500 border rounded-md">
                    No production stages added to this recipe
                  </div>
                )}
              </div>

              {/* Total Cost Row */}
              <table className="w-full border-collapse">
                <tfoot>
                  <TotalCostRow totalCost={totalCost} />
                </tfoot>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecipeFullTable;

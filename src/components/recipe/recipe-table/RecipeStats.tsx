
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface RecipeStatsProps {
  quantity: number;
  showStats: boolean;
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
  materialCost: number;
  laborCost: number;
  machineCost: number;
  totalCost: number;
}

export const RecipeStats: React.FC<RecipeStatsProps> = ({
  quantity,
  showStats,
  setShowStats,
  materialCost,
  laborCost,
  machineCost,
  totalCost
}) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const data = [
    { name: "Materials", value: materialCost },
    { name: "Labor", value: laborCost },
    { name: "Machine", value: machineCost },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No cost data available for visualization
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-2">Cost Distribution</h3>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, null]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <div className="stats grid grid-cols-1 gap-2 mt-4 md:mt-0">
            <div className="stat flex flex-col p-2 bg-white rounded-md shadow-sm">
              <div className="text-muted-foreground text-sm">Total Cost</div>
              <div className="font-bold text-lg">
                ${totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Per Unit: ${(totalCost / (quantity || 1)).toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                className="stat flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4"
                style={{ borderLeftColor: COLORS[0] }}
              >
                <div className="text-muted-foreground text-xs">Materials</div>
                <div className="font-semibold">
                  ${materialCost.toFixed(2)}
                </div>
                <div className="text-xs">
                  {totalCost
                    ? `${((materialCost / totalCost) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
              <div
                className="stat flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4"
                style={{ borderLeftColor: COLORS[1] }}
              >
                <div className="text-muted-foreground text-xs">Labor</div>
                <div className="font-semibold">${laborCost.toFixed(2)}</div>
                <div className="text-xs">
                  {totalCost
                    ? `${((laborCost / totalCost) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
              <div
                className="stat flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4"
                style={{ borderLeftColor: COLORS[2] }}
              >
                <div className="text-muted-foreground text-xs">Machine</div>
                <div className="font-semibold">${machineCost.toFixed(2)}</div>
                <div className="text-xs">
                  {totalCost
                    ? `${((machineCost / totalCost) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

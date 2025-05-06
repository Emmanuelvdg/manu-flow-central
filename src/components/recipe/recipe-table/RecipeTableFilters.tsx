
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, FilterX } from "lucide-react";

interface RecipeTableFiltersProps {
  onFilterChange: (filters: RecipeFilters) => void;
  maxPossibleCost: number;
}

export interface RecipeFilters {
  materialNameFilter: string;
  minCostThreshold: number;
}

const RecipeTableFilters: React.FC<RecipeTableFiltersProps> = ({ 
  onFilterChange,
  maxPossibleCost = 100 
}) => {
  const [materialNameFilter, setMaterialNameFilter] = useState<string>("");
  const [minCostThreshold, setMinCostThreshold] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMaterialNameFilter(newValue);
    onFilterChange({
      materialNameFilter: newValue,
      minCostThreshold
    });
  };

  const handleCostThresholdChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(value);
    setMinCostThreshold(newValue);
    onFilterChange({
      materialNameFilter,
      minCostThreshold: newValue
    });
  };

  const handleClearFilters = () => {
    setMaterialNameFilter("");
    setMinCostThreshold(0);
    setSliderValue([0]);
    onFilterChange({
      materialNameFilter: "",
      minCostThreshold: 0
    });
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 border rounded-md">
      <div className="text-sm font-medium mb-2">Filter Materials</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="materialFilter">Material Name</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="materialFilter"
              placeholder="Filter by name..."
              value={materialNameFilter}
              onChange={handleNameFilterChange}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-1">
          <div className="flex justify-between">
            <Label htmlFor="costThreshold">Min Cost: ${minCostThreshold}</Label>
          </div>
          <Slider
            id="costThreshold"
            value={sliderValue}
            onValueChange={handleCostThresholdChange}
            max={maxPossibleCost}
            step={1}
            className="py-2"
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeTableFilters;

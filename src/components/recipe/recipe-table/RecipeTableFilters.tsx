
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Package2, Users2, Cog } from 'lucide-react';
import { RecipeTableFiltersProps } from './types';

const RecipeTableFilters: React.FC<RecipeTableFiltersProps> = ({
  showPersonnel,
  showMachines,
  showMaterials,
  setFilters,
  quantity,
  setQuantity
}) => {
  const handleFilterToggle = (filterName: string, value: boolean) => {
    setFilters(current => ({
      ...current,
      [filterName]: value
    }));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b">
      <div className="flex items-center gap-2">
        <div className="font-medium text-sm">Filters:</div>
        <ToggleGroup type="multiple">
          <ToggleGroupItem
            value="materials"
            aria-label="Toggle materials"
            data-state={showMaterials ? "on" : "off"}
            onClick={() => handleFilterToggle('showMaterials', !showMaterials)}
          >
            <Package2 className="h-4 w-4 mr-1" />
            Materials
          </ToggleGroupItem>
          
          <ToggleGroupItem
            value="personnel"
            aria-label="Toggle personnel"
            data-state={showPersonnel ? "on" : "off"}
            onClick={() => handleFilterToggle('showPersonnel', !showPersonnel)}
          >
            <Users2 className="h-4 w-4 mr-1" />
            Personnel
          </ToggleGroupItem>
          
          <ToggleGroupItem
            value="machines"
            aria-label="Toggle machines"
            data-state={showMachines ? "on" : "off"}
            onClick={() => handleFilterToggle('showMachines', !showMachines)}
          >
            <Cog className="h-4 w-4 mr-1" />
            Machines
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity:
        </label>
        <Input
          id="quantity"
          type="number"
          min="1"
          className="w-20"
          value={quantity}
          onChange={e => setQuantity && setQuantity(Number(e.target.value) || 1)}
        />
      </div>
    </div>
  );
};

export default RecipeTableFilters;

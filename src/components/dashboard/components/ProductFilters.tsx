
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onAddProduct: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  categories,
  onCategoryChange,
  onAddProduct,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Top row with search and add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          onClick={onAddProduct}
          className="whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Category filter buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        <Button 
          variant={filterCategory === '' ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange('')}
          className="flex-shrink-0"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/input';
import { Download, Upload, Plus, Search, Edit, BarChart } from 'lucide-react';
import ColorBox from '@/components/recipe/colorBox';

// Mock data for the recipe dashboard
const mockRecipes = [
  {
    id: "BO00001",
    name: "Mechanical Subassembly BOM",
    partNo: "MS11",
    partDescription: "Mechanical Subassembly",
    groupNumber: "M2",
    groupName: "Mechanical: Subassemblies",
    approxCost: "USD 35.00"
  },
  {
    id: "BO00010",
    name: "FA Final assembly BOM",
    partNo: "FA",
    partDescription: "Final assembly",
    groupNumber: "M1",
    groupName: "Mechanical: Finished goods",
    approxCost: "USD 380.00"
  },
  {
    id: "BO00011",
    name: "Main Subassembly BOM",
    partNo: "MS1",
    partDescription: "Main Subassembly",
    groupNumber: "M2",
    groupName: "Mechanical: Subassemblies",
    approxCost: "USD 230.00"
  },
  {
    id: "BO00024",
    name: "BFP Base Product BOM",
    partNo: "BBFP",
    partDescription: "Base Bulk Food Product",
    groupNumber: "F2",
    groupName: "Food: Half-products",
    approxCost: "USD 0.60"
  },
  {
    id: "PFP_5L",
    name: "Packaged Food Product, 5L Canister",
    partNo: "PFP-5L",
    partDescription: "Food Product in 5L Canister",
    groupNumber: "F1",
    groupName: "Food: Finished goods",
    approxCost: "USD 12.50"
  },
  {
    id: "WT",
    name: "Wooden Table",
    partNo: "WT-STD",
    partDescription: "Standard Wooden Table",
    groupNumber: "F1",
    groupName: "Furniture: Finished goods",
    approxCost: "USD 95.00"
  }
];

const RecipesDashboard = () => {
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      header: "#",
      accessorKey: "index",
      cell: (row: any) => row.row.index + 1
    },
    {
      header: "Number",
      accessorKey: "id"
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (row: any) => (
        <span className="text-blue-600 underline hover:text-blue-800">
          {row.row.original.name}
        </span>
      )
    },
    {
      header: "Part No.",
      accessorKey: "partNo"
    },
    {
      header: "Part description",
      accessorKey: "partDescription"
    },
    {
      header: "Group number",
      accessorKey: "groupNumber"
    },
    {
      header: "Group name",
      accessorKey: "groupName"
    },
    {
      header: "Approximate cost",
      accessorKey: "approxCost"
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Link to={`/recipes/${row.row.original.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <BarChart className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredRecipes = mockRecipes.filter(recipe => {
    // Extract numeric value from cost string, e.g., "USD 35.00" -> 35.00
    const cost = parseFloat(recipe.approxCost.replace("USD ", "").replace(",", ""));
    const minCostValue = minCost ? parseFloat(minCost) : 0;
    const maxCostValue = maxCost ? parseFloat(maxCost) : Infinity;
    
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      Object.values(recipe).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Apply cost range filter
    const matchesCostRange = cost >= minCostValue && cost <= maxCostValue;
    
    return matchesSearch && matchesCostRange;
  });

  const handleClearFilters = () => {
    setMinCost('');
    setMaxCost('');
    setSearchTerm('');
  };

  const handleSearch = () => {
    // The filtering is already reactive based on state
    console.log('Search triggered with term:', searchTerm);
  };

  return (
    <MainLayout title="Recipe Management">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">BOM</div>
          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link to="/recipes/create">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import from CSV
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md border">
          <div className="p-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Input placeholder="Number" />
              <Input placeholder="Name" />
              <Input placeholder="Part No." />
              <Input placeholder="Part description" />
              <Input placeholder="Group number" />
            </div>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="min" 
                className="w-24" 
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
              />
              <span>-</span>
              <Input 
                placeholder="max" 
                className="w-24"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </div>
          </div>

          <DataTable 
            columns={columns} 
            data={filteredRecipes}
            onRowClick={(row) => {
              window.location.href = `/recipes/${row.id}`;
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default RecipesDashboard;

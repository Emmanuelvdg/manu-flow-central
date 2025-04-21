
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Enhanced mock recipes to demonstrate mapping (sample data)
const mockRecipes = {
  "PFP_5L": {
    id: "PFP_5L",
    productName: "Packaged Food Product, 5L Canister",
    group: "Food: Finished goods",
    materials: [
      { id: "MAT-010", name: "Plastic Canister 5L", quantity: 1, unit: "pcs" },
      { id: "MAT-005", name: "Label", quantity: 1, unit: "pcs" },
      { id: "MAT-003", name: "Food filling", quantity: 5, unit: "l" }
    ],
    personnel: [
      { id: "1", role: "Packaging Operator", hours: 2 },
      { id: "2", role: "Quality Inspector", hours: 1 }
    ],
    machines: [
      { id: "MACH-003", machine: "Filling Line", hours: 1.5 },
      { id: "MACH-004", machine: "Labeling Machine", hours: 0.5 }
    ]
  },
  "WT": {
    id: "WT",
    productName: "Wooden Table",
    group: "Tables: Finished goods",
    materials: [
      { id: "MAT-011", name: "Wood Panel", quantity: 3, unit: "pcs" },
      { id: "MAT-012", name: "Table Legs", quantity: 4, unit: "pcs" },
      { id: "MAT-005", name: "Screws", quantity: 8, unit: "pcs" }
    ],
    personnel: [
      { id: "3", role: "Carpenter", hours: 3 },
      { id: "4", role: "Assembler", hours: 1 }
    ],
    machines: [
      { id: "MACH-008", machine: "Table Saw", hours: 1 },
      { id: "MACH-012", machine: "Drill Press", hours: 0.5 }
    ]
  },
};

const colorBox = (color: string) => (
  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${color}`}></span>
);

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const recipe = mockRecipes[id as keyof typeof mockRecipes] || mockRecipes["PFP_5L"];

  const handleEdit = () => {
    toast({
      title: "Edit Recipe",
      description: "Recipe editing feature coming soon.",
    });
  };
  const handleAddMaterial = () => {
    toast({
      title: "Add Material",
      description: "Material addition feature coming soon.",
    });
  };
  const handleAddPersonnel = () => {
    toast({
      title: "Add Personnel",
      description: "Personnel addition feature coming soon.",
    });
  };
  const handleAddMachine = () => {
    toast({
      title: "Add Machine",
      description: "Machine addition feature coming soon.",
    });
  };

  return (
    <MainLayout title="Product Recipe Mapping">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/recipes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{recipe.productName} ({recipe.id})</CardTitle>
            <div className="text-sm text-muted-foreground">{recipe.group}</div>
          </CardHeader>
          <CardContent>
            {/* Group each requirement visually */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Materials */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-indigo-800">Materials</span>
                  <Button variant="outline" size="xs" onClick={handleAddMaterial}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="rounded border p-2 bg-gray-50">
                  <ul>
                    {recipe.materials.map((mat) => (
                      <li key={mat.id} className="flex items-center gap-2 py-1 text-xs">
                        {colorBox("bg-yellow-400")}
                        <strong>{mat.name}</strong>
                        <span className="ml-auto text-gray-500">{mat.quantity} {mat.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Personnel */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-green-800">Personnel</span>
                  <Button variant="outline" size="xs" onClick={handleAddPersonnel}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="rounded border p-2 bg-gray-50">
                  <ul>
                    {recipe.personnel.map((person) => (
                      <li key={person.id} className="flex items-center gap-2 py-1 text-xs">
                        {colorBox("bg-green-400")}
                        <strong>{person.role}</strong>
                        <span className="ml-auto text-gray-500">{person.hours} hr</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Machines */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-800">Machines</span>
                  <Button variant="outline" size="xs" onClick={handleAddMachine}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="rounded border p-2 bg-gray-50">
                  <ul>
                    {recipe.machines.map((mach) => (
                      <li key={mach.id} className="flex items-center gap-2 py-1 text-xs">
                        {colorBox("bg-blue-400")}
                        <strong>{mach.machine}</strong>
                        <span className="ml-auto text-gray-500">{mach.hours} hr</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* All data table for the mapping */}
            <div className="mt-4">
              <div className="mb-2 font-semibold text-gray-700 text-sm">Full Recipe Table</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name / Role / Machine</TableHead>
                    <TableHead className="text-center">Qty / Hrs</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.materials.map((m) => (
                    <TableRow key={m.id + "_mat"}>
                      <TableCell className="text-yellow-800">Material</TableCell>
                      <TableCell>{m.name}</TableCell>
                      <TableCell className="text-center">{m.quantity}</TableCell>
                      <TableCell>{m.unit}</TableCell>
                    </TableRow>
                  ))}
                  {recipe.personnel.map((p) => (
                    <TableRow key={p.id + "_pers"}>
                      <TableCell className="text-green-800">Personnel</TableCell>
                      <TableCell>{p.role}</TableCell>
                      <TableCell className="text-center">{p.hours}</TableCell>
                      <TableCell>hr</TableCell>
                    </TableRow>
                  ))}
                  {recipe.machines.map((m) => (
                    <TableRow key={m.id + "_mach"}>
                      <TableCell className="text-blue-800">Machine</TableCell>
                      <TableCell>{m.machine}</TableCell>
                      <TableCell className="text-center">{m.hours}</TableCell>
                      <TableCell>hr</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Recipe;

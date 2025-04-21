
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock recipe data
const mockRecipes = {
  'CP-2000-RECIPE': {
    id: 'CP-2000-RECIPE',
    productName: 'Control Panel CP-2000',
    description: 'Industrial control panel with LCD interface',
    leadTime: '3 weeks',
    materials: [
      { id: 'MAT-001', name: 'LCD Display 10"', quantity: 1, unit: 'pcs' },
      { id: 'MAT-002', name: 'Circuit Board A-300', quantity: 2, unit: 'pcs' },
      { id: 'MAT-003', name: 'Control Switches', quantity: 12, unit: 'pcs' },
      { id: 'MAT-004', name: 'Aluminum Casing', quantity: 1, unit: 'pcs' },
      { id: 'MAT-005', name: 'Wiring Harness', quantity: 1, unit: 'set' },
      { id: 'MAT-006', name: 'Mounting Brackets', quantity: 4, unit: 'pcs' },
    ],
    personnel: [
      { id: 'PERS-001', role: 'Electronics Engineer', hours: 8 },
      { id: 'PERS-002', role: 'Assembly Technician', hours: 16 },
      { id: 'PERS-003', role: 'Quality Control Specialist', hours: 4 },
    ],
    machineTime: [
      { id: 'MACH-001', machine: 'PCB Soldering Station', hours: 4 },
      { id: 'MACH-002', machine: 'Testing Equipment', hours: 6 },
    ],
    notes: 'Ensure all wiring connections are secure and properly insulated. Perform full functionality test before shipping.'
  },
  'XL-5000-RECIPE': {
    id: 'XL-5000-RECIPE',
    productName: 'Industrial Pump XL-5000',
    description: 'High-capacity industrial pump for heavy-duty applications',
    leadTime: '4 weeks',
    materials: [
      { id: 'MAT-010', name: 'Pump Housing', quantity: 1, unit: 'pcs' },
      { id: 'MAT-011', name: 'Electric Motor', quantity: 1, unit: 'pcs' },
      { id: 'MAT-012', name: 'Impeller Assembly', quantity: 1, unit: 'set' },
      { id: 'MAT-013', name: 'Shaft Seal Kit', quantity: 2, unit: 'sets' },
      { id: 'MAT-014', name: 'Mounting Base', quantity: 1, unit: 'pcs' },
      { id: 'MAT-015', name: 'Control Panel', quantity: 1, unit: 'pcs' },
      { id: 'MAT-016', name: 'Connector Fittings', quantity: 4, unit: 'sets' },
    ],
    personnel: [
      { id: 'PERS-004', role: 'Mechanical Engineer', hours: 12 },
      { id: 'PERS-005', role: 'Assembly Technician', hours: 24 },
      { id: 'PERS-006', role: 'Electrician', hours: 8 },
      { id: 'PERS-003', role: 'Quality Control Specialist', hours: 6 },
    ],
    machineTime: [
      { id: 'MACH-003', machine: 'CNC Machine', hours: 8 },
      { id: 'MACH-004', machine: 'Hydraulic Press', hours: 4 },
      { id: 'MACH-005', machine: 'Pump Testing Station', hours: 10 },
    ],
    notes: 'All pump assemblies must be pressure tested before final assembly. Ensure proper alignment of motor and pump housing to prevent vibration.'
  }
};

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // In a real app, you would fetch the recipe data using the ID
  const recipe = mockRecipes[id as keyof typeof mockRecipes] || mockRecipes['CP-2000-RECIPE'];
  
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

  return (
    <MainLayout title="Recipe Details">
      <div className="space-y-6">
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
            <CardTitle className="text-xl">{recipe.productName} Recipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recipe Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Recipe ID:</span>
                    <span className="text-sm">{recipe.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Product:</span>
                    <span className="text-sm">{recipe.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Lead Time:</span>
                    <span className="text-sm">{recipe.leadTime}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{recipe.description}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Materials Required</h3>
                <Button variant="outline" size="sm" onClick={handleAddMaterial}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.id}</TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell className="text-right">{material.quantity}</TableCell>
                      <TableCell className="text-right">{material.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Personnel Required</h3>
                <Button variant="outline" size="sm" onClick={handleAddPersonnel}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Personnel
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.personnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>{person.id}</TableCell>
                      <TableCell>{person.role}</TableCell>
                      <TableCell className="text-right">{person.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-4">Machine Time</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.machineTime.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell>{machine.id}</TableCell>
                      <TableCell>{machine.machine}</TableCell>
                      <TableCell className="text-right">{machine.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-gray-600">{recipe.notes}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Recipe;

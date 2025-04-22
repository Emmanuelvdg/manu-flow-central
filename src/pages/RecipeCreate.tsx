
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Check, Database, Link2, File, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RecipeCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [recipeName, setRecipeName] = useState('');
  const [parts, setParts] = useState([{ id: 1, productGroup: '', part: '', notes: '', uom: '', quantity: '' }]);
  
  const handleAddPart = () => {
    setParts([...parts, { 
      id: Date.now(), 
      productGroup: '', 
      part: '', 
      notes: '', 
      uom: '', 
      quantity: '' 
    }]);
  };
  
  const handleRemovePart = (id: number) => {
    setParts(parts.filter(part => part.id !== id));
  };
  
  const handlePartChange = (id: number, field: string, value: string) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };
  
  const handleSave = () => {
    // Here you would typically send data to your backend
    toast({
      title: "Recipe Saved",
      description: `Created BOM for ${recipeName || 'PFP_5L Packaged Food Product, 5L Canister'}`,
    });
    navigate('/recipes');
  };
  
  const productGroups = [
    { value: 'raw-materials', label: 'Raw Materials' },
    { value: 'mechanical-parts', label: 'Mechanical Parts' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'food-ingredients', label: 'Food Ingredients' }
  ];
  
  const partOptions = [
    { value: 'plastic-canister', label: 'Plastic Canister 5L' },
    { value: 'label', label: 'Label' },
    { value: 'food-filling', label: 'Food Filling' },
    { value: 'table-leg', label: 'Table Leg' }
  ];
  
  const uomOptions = [
    { value: 'pcs', label: 'pcs' },
    { value: 'kg', label: 'kg' },
    { value: 'l', label: 'l' },
    { value: 'g', label: 'g' }
  ];

  return (
    <MainLayout title="Create Recipe">
      <div className="space-y-6">
        <div className="text-2xl font-bold">
          Create a BOM for PFP_5L Packaged Food Product, 5L Canister
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/recipes">
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-sm font-medium">Product</div>
                <div className="text-base">PFP_5L Packaged Food Product, 5L Canister</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Name <span className="text-red-500">*</span></div>
                <Input 
                  value={recipeName} 
                  onChange={(e) => setRecipeName(e.target.value)} 
                  placeholder="Recipe name"
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Copy BOM</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a BOM to copy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bo00001">BO00001 - Mechanical Subassembly BOM</SelectItem>
                    <SelectItem value="bo00010">BO00010 - FA Final assembly BOM</SelectItem>
                    <SelectItem value="bo00011">BO00011 - Main Subassembly BOM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Routings</div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="routing" className="h-4 w-4 rounded" checked />
                  <label htmlFor="routing" className="text-sm">
                    R00037 PFP5L | Packaged Food Product 5l canister routing
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Files</div>
                <div className="flex space-x-4">
                  <button className="text-blue-600">
                    <Database className="h-5 w-5" />
                  </button>
                  <button className="text-blue-600">
                    <File className="h-5 w-5" />
                  </button>
                  <button className="text-blue-600">
                    <Link2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Parts</div>
                
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UoM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parts.map((part, index) => (
                        <tr key={part.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              value={part.productGroup}
                              onValueChange={(value) => handlePartChange(part.id, 'productGroup', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {productGroups.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              value={part.part}
                              onValueChange={(value) => handlePartChange(part.id, 'part', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {partOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Input 
                              value={part.notes}
                              onChange={(e) => handlePartChange(part.id, 'notes', e.target.value)}
                              placeholder="Notes"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              value={part.uom}
                              onValueChange={(value) => handlePartChange(part.id, 'uom', value)}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="UoM" />
                              </SelectTrigger>
                              <SelectContent>
                                {uomOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Input 
                              type="number"
                              value={part.quantity}
                              onChange={(e) => handlePartChange(part.id, 'quantity', e.target.value)}
                              placeholder="Qty"
                              className="w-[100px]"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemovePart(part.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <Button variant="outline" onClick={handleAddPart}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add part
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RecipeCreate;

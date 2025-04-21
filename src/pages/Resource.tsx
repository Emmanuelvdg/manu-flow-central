
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock resources data
const mockMaterials = [
  { id: 'MAT-001', name: 'LCD Display 10"', category: 'Electronics', stock: 24, unit: 'pcs', status: 'In Stock', vendor: 'Tech Displays Inc' },
  { id: 'MAT-002', name: 'Circuit Board A-300', category: 'Electronics', stock: 48, unit: 'pcs', status: 'In Stock', vendor: 'CircuitPro Systems' },
  { id: 'MAT-003', name: 'Control Switches', category: 'Electronics', stock: 120, unit: 'pcs', status: 'In Stock', vendor: 'SwitchTech' },
  { id: 'MAT-004', name: 'Aluminum Casing', category: 'Structural', stock: 15, unit: 'pcs', status: 'Low Stock', vendor: 'MetalWorks Corp' },
  { id: 'MAT-005', name: 'Wiring Harness', category: 'Electrical', stock: 35, unit: 'set', status: 'In Stock', vendor: 'WireWorks Ltd' },
  { id: 'MAT-006', name: 'Mounting Brackets', category: 'Structural', stock: 62, unit: 'pcs', status: 'In Stock', vendor: 'MetalWorks Corp' },
  { id: 'MAT-010', name: 'Pump Housing', category: 'Mechanical', stock: 8, unit: 'pcs', status: 'Low Stock', vendor: 'FluidTech Industries' },
  { id: 'MAT-011', name: 'Electric Motor', category: 'Electrical', stock: 12, unit: 'pcs', status: 'In Stock', vendor: 'MotorWorks Inc' },
  { id: 'MAT-012', name: 'Impeller Assembly', category: 'Mechanical', stock: 10, unit: 'set', status: 'In Stock', vendor: 'FluidTech Industries' },
];

const mockPersonnel = [
  { id: 'PERS-001', name: 'Jane Smith', role: 'Electronics Engineer', department: 'Engineering', specialty: 'Circuit Design', availability: 'Available' },
  { id: 'PERS-002', name: 'Mike Johnson', role: 'Assembly Technician', department: 'Manufacturing', specialty: 'PCB Assembly', availability: 'Assigned' },
  { id: 'PERS-003', name: 'Sarah Williams', role: 'Quality Control Specialist', department: 'Quality', specialty: 'Electronic Testing', availability: 'Available' },
  { id: 'PERS-004', name: 'Robert Chen', role: 'Mechanical Engineer', department: 'Engineering', specialty: 'Fluid Dynamics', availability: 'Available' },
  { id: 'PERS-005', name: 'David Patel', role: 'Assembly Technician', department: 'Manufacturing', specialty: 'Mechanical Assembly', availability: 'Available' },
  { id: 'PERS-006', name: 'Maria Garcia', role: 'Electrician', department: 'Manufacturing', specialty: 'Power Systems', availability: 'Assigned' },
];

const mockMachines = [
  { id: 'MACH-001', name: 'PCB Soldering Station', department: 'Electronics', status: 'Operational', maintenance: '2025-05-15', utilization: '75%' },
  { id: 'MACH-002', name: 'Testing Equipment', department: 'Quality', status: 'Operational', maintenance: '2025-06-20', utilization: '60%' },
  { id: 'MACH-003', name: 'CNC Machine', department: 'Machining', status: 'Operational', maintenance: '2025-05-10', utilization: '90%' },
  { id: 'MACH-004', name: 'Hydraulic Press', department: 'Manufacturing', status: 'Maintenance', maintenance: '2025-04-25', utilization: '0%' },
  { id: 'MACH-005', name: 'Pump Testing Station', department: 'Quality', status: 'Operational', maintenance: '2025-07-05', utilization: '55%' },
];

const Resource = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('materials');
  
  const handleAdd = (type: string) => {
    toast({
      title: `Add ${type}`,
      description: `${type} addition feature coming soon.`,
    });
  };
  
  const materialColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Material', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'In Stock', accessorKey: 'stock' },
    { header: 'Unit', accessorKey: 'unit' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Vendor', accessorKey: 'vendor' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];
  
  const personnelColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Specialty', accessorKey: 'specialty' },
    { header: 'Availability', accessorKey: 'availability' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];
  
  const machineColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Machine', accessorKey: 'name' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Next Maintenance', accessorKey: 'maintenance' },
    { header: 'Utilization', accessorKey: 'utilization' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <MainLayout title="Resources">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="machines">Machines</TabsTrigger>
            </TabsList>
            
            <Button 
              size="sm" 
              onClick={() => handleAdd(
                activeTab === 'materials' ? 'Material' : 
                activeTab === 'personnel' ? 'Personnel' : 'Machine'
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {activeTab === 'materials' ? 'Material' : activeTab === 'personnel' ? 'Personnel' : 'Machine'}
            </Button>
          </div>
          
          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Materials Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={materialColumns} 
                  data={mockMaterials}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="personnel" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personnel Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={personnelColumns} 
                  data={mockPersonnel}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="machines" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Machines & Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={machineColumns} 
                  data={mockMachines}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Resource;

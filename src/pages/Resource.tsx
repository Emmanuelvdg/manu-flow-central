
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Plus, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MaterialEditDialog } from '@/components/resources/MaterialEditDialog';
import { PurchaseOrderDialog } from '@/components/resources/PurchaseOrderDialog';
import { Material, PurchaseOrder } from '@/types/material';

// Mock resources data
const mockMaterials: Material[] = [
  { id: 'MAT-001', name: 'LCD Display 10"', category: 'Electronics', stock: 24, unit: 'pcs', status: 'In Stock', vendor: 'Tech Displays Inc', costPerUnit: 45.99 },
  { id: 'MAT-002', name: 'Circuit Board A-300', category: 'Electronics', stock: 48, unit: 'pcs', status: 'In Stock', vendor: 'CircuitPro Systems', costPerUnit: 22.50 },
  { id: 'MAT-003', name: 'Control Switches', category: 'Electronics', stock: 120, unit: 'pcs', status: 'In Stock', vendor: 'SwitchTech', costPerUnit: 3.75 },
  { id: 'MAT-004', name: 'Aluminum Casing', category: 'Structural', stock: 15, unit: 'pcs', status: 'Low Stock', vendor: 'MetalWorks Corp', costPerUnit: 18.25 },
  { id: 'MAT-005', name: 'Wiring Harness', category: 'Electrical', stock: 35, unit: 'set', status: 'In Stock', vendor: 'WireWorks Ltd', costPerUnit: 12.99 },
  { id: 'MAT-006', name: 'Mounting Brackets', category: 'Structural', stock: 62, unit: 'pcs', status: 'In Stock', vendor: 'MetalWorks Corp', costPerUnit: 5.50 },
  { id: 'MAT-010', name: 'Pump Housing', category: 'Mechanical', stock: 8, unit: 'pcs', status: 'Low Stock', vendor: 'FluidTech Industries', costPerUnit: 65.00 },
  { id: 'MAT-011', name: 'Electric Motor', category: 'Electrical', stock: 12, unit: 'pcs', status: 'In Stock', vendor: 'MotorWorks Inc', costPerUnit: 85.99 },
  { id: 'MAT-012', name: 'Impeller Assembly', category: 'Mechanical', stock: 10, unit: 'set', status: 'In Stock', vendor: 'FluidTech Industries', costPerUnit: 42.75 },
];

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', materialId: 'MAT-004', quantity: 30, status: 'Ordered', orderDate: '2025-04-10', expectedDelivery: '2025-04-25', vendor: 'MetalWorks Corp', totalCost: 547.50 },
  { id: 'PO-002', materialId: 'MAT-010', quantity: 15, status: 'Pending', orderDate: '2025-04-15', expectedDelivery: '2025-05-01', vendor: 'FluidTech Industries', totalCost: 975.00 },
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
  const [materials, setMaterials] = useState(mockMaterials);
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPurchaseOrderDialogOpen, setIsPurchaseOrderDialogOpen] = useState(false);
  const [selectedMaterialForPO, setSelectedMaterialForPO] = useState<Material | null>(null);
  
  const handleAdd = (type: string) => {
    toast({
      title: `Add ${type}`,
      description: `${type} addition feature coming soon.`,
    });
  };
  
  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsEditDialogOpen(true);
  };
  
  const handleCreatePO = (material: Material) => {
    setSelectedMaterialForPO(material);
    setIsPurchaseOrderDialogOpen(true);
  };
  
  const handleSaveMaterial = (updatedMaterial: Material) => {
    setMaterials(materials.map(material => 
      material.id === updatedMaterial.id ? updatedMaterial : material
    ));
  };
  
  const handleCreateOrder = (newOrder: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, newOrder]);
  };
  
  const materialColumns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Material', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'In Stock', accessorKey: 'stock' },
    { header: 'Unit', accessorKey: 'unit' },
    { header: 'Cost/Unit', accessorKey: 'costPerUnit', cell: (row: Material) => 
      row.costPerUnit ? `$${row.costPerUnit.toFixed(2)}` : 'N/A'
    },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Vendor', accessorKey: 'vendor' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: Material) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCreatePO(row);
            }}
          >
            <FileText className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2 md:text-xs">Order</span>
          </Button>
        </div>
      )
    }
  ];
  
  const purchaseOrderColumns = [
    { header: 'PO ID', accessorKey: 'id' },
    { header: 'Material ID', accessorKey: 'materialId' },
    { header: 'Material', accessorKey: 'materialName', cell: (row: PurchaseOrder) => {
      const material = materials.find(m => m.id === row.materialId);
      return material ? material.name : 'Unknown';
    }},
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Total Cost', accessorKey: 'totalCost', cell: (row: PurchaseOrder) => 
      `$${row.totalCost.toFixed(2)}`
    },
    { header: 'Order Date', accessorKey: 'orderDate' },
    { header: 'Expected Delivery', accessorKey: 'expectedDelivery' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Vendor', accessorKey: 'vendor' },
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
              <TabsTrigger value="purchaseOrders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="machines">Machines</TabsTrigger>
            </TabsList>
            
            <Button 
              size="sm" 
              onClick={() => handleAdd(
                activeTab === 'materials' ? 'Material' : 
                activeTab === 'personnel' ? 'Personnel' : 
                activeTab === 'purchaseOrders' ? 'Purchase Order' : 'Machine'
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {activeTab === 'materials' ? 'Material' : 
                   activeTab === 'personnel' ? 'Personnel' : 
                   activeTab === 'purchaseOrders' ? 'Purchase Order' : 'Machine'}
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
                  data={materials}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="purchaseOrders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={purchaseOrderColumns} 
                  data={purchaseOrders}
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
      
      {/* Material Edit Dialog */}
      {editingMaterial && (
        <MaterialEditDialog 
          material={editingMaterial}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveMaterial}
        />
      )}
      
      {/* Purchase Order Dialog */}
      {selectedMaterialForPO && (
        <PurchaseOrderDialog
          material={selectedMaterialForPO}
          isOpen={isPurchaseOrderDialogOpen}
          onClose={() => setIsPurchaseOrderDialogOpen(false)}
          onCreateOrder={handleCreateOrder}
        />
      )}
    </MainLayout>
  );
};

export default Resource;

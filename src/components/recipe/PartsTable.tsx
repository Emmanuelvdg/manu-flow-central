
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Part {
  id: number;
  productGroup: string;
  part: string;
  notes: string;
  uom: string;
  quantity: string;
}

interface PartsTableProps {
  parts: Part[];
  onPartChange: (id: number, field: string, value: string) => void;
  onRemovePart: (id: number) => void;
  productGroups: { value: string; label: string; }[];
  partOptions: { value: string; label: string; }[];
  uomOptions: { value: string; label: string; }[];
}

const PartsTable: React.FC<PartsTableProps> = ({
  parts,
  onPartChange,
  onRemovePart,
  productGroups,
  partOptions,
  uomOptions,
}) => {
  return (
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
                onValueChange={(value) => onPartChange(part.id, 'productGroup', value)}
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
                onValueChange={(value) => onPartChange(part.id, 'part', value)}
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
                onChange={(e) => onPartChange(part.id, 'notes', e.target.value)}
                placeholder="Notes"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Select
                value={part.uom}
                onValueChange={(value) => onPartChange(part.id, 'uom', value)}
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
                onChange={(e) => onPartChange(part.id, 'quantity', e.target.value)}
                placeholder="Qty"
                className="w-[100px]"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemovePart(part.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PartsTable;

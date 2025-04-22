
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockMachines = [
  { id: 1, name: 'CNC Machine A1', type: 'CNC', status: 'Operational', lastMaintenance: '2025-03-15' },
  { id: 2, name: 'Assembly Line B2', type: 'Assembly', status: 'Under Maintenance', lastMaintenance: '2025-04-01' },
  { id: 3, name: 'Packaging Unit C3', type: 'Packaging', status: 'Operational', lastMaintenance: '2025-03-28' },
  { id: 4, name: 'Quality Scanner D4', type: 'QA Equipment', status: 'Operational', lastMaintenance: '2025-04-10' },
];

export const MachinesTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Maintenance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockMachines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.name}</TableCell>
              <TableCell>{machine.type}</TableCell>
              <TableCell>{machine.status}</TableCell>
              <TableCell>{machine.lastMaintenance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPersonnel = [
  { id: 1, name: 'John Doe', role: 'Production Manager', department: 'Manufacturing', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'Quality Control', department: 'QA', status: 'Active' },
  { id: 3, name: 'Mike Johnson', role: 'Machine Operator', department: 'Production', status: 'Active' },
  { id: 4, name: 'Sarah Wilson', role: 'Maintenance Technician', department: 'Maintenance', status: 'Active' },
];

export const PersonnelTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPersonnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.role}</TableCell>
              <TableCell>{person.department}</TableCell>
              <TableCell>{person.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonnelRoles } from "../recipe/recipeDataUtils";

export const PersonnelTable = () => {
  const { data: personnelRoles = [], isLoading, error } = useQuery({
    queryKey: ["personnel_roles"],
    queryFn: fetchPersonnelRoles,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={1}>
                Loading personnel roles...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell className="h-24 text-center text-destructive" colSpan={1}>
                Could not load personnel roles. {String(error)}
              </TableCell>
            </TableRow>
          ) : personnelRoles.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={1}>
                No personnel roles found.
              </TableCell>
            </TableRow>
          ) : (
            personnelRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.role}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

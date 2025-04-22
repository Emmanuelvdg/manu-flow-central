
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ColumnCellProps<T> {
  getValue: () => any;
  row: {
    original: T;
  };
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (props: ColumnCellProps<T>) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={column.header || index} className="font-semibold">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${column.header || colIndex}`}>
                    {column.cell
                      ? column.cell({
                          getValue: () => {
                            const key = typeof column.accessorKey === 'string' 
                              ? column.accessorKey 
                              : column.accessorKey.toString();
                            return (row as any)[key];
                          },
                          row: { original: row }
                        })
                      : typeof column.accessorKey === 'string'
                        ? (row as any)[column.accessorKey]
                        : (row[column.accessorKey] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

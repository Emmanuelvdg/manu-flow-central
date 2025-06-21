
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  maxHeight?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onRowClick,
  maxHeight = "calc(100vh - 200px)"
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border w-full h-full flex flex-col">
      <ScrollArea className="flex-1" style={{ maxHeight }}>
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={column.header || index} 
                    className="font-semibold whitespace-nowrap"
                    style={{ width: column.width || 'auto' }}
                  >
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
                    {columns.map((column, colIndex) => {
                      const accessorKey = column.accessorKey.toString();
                      
                      if (!row) {
                        return <TableCell key={`${rowIndex}-${column.header || colIndex}`}>-</TableCell>;
                      }
                      
                      return (
                        <TableCell 
                          key={`${rowIndex}-${column.header || colIndex}`} 
                          className="table-cell-responsive"
                          style={{ width: column.width || 'auto' }}
                        >
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
                              ? (row as any)[column.accessorKey] ?? '-'
                              : (row as any)[column.accessorKey.toString()] ?? '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}

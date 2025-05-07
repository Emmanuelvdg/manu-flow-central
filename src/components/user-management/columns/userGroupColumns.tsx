
import React from 'react';
import { Column, ColumnCellProps } from '@/components/ui/DataTable';
import { UserGroupActions } from '../UserGroupActions';
import { formatDate } from '@/components/dashboard/quotes/utils/formatUtils';

interface UserGroup {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const UserGroupColumns = ({ refetch }: { refetch: () => void }): Column<UserGroup>[] => [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: (props: ColumnCellProps<UserGroup>) => {
      return props.getValue() || '-';
    }
  },
  {
    header: 'Created',
    accessorKey: 'created_at',
    cell: (props: ColumnCellProps<UserGroup>) => formatDate(props.getValue()),
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: (props: ColumnCellProps<UserGroup>) => {
      const row = props.row.original;
      return (
        <UserGroupActions
          userGroupId={row.id}
          userGroupName={row.name}
          onSuccess={refetch}
        />
      );
    }
  }
];

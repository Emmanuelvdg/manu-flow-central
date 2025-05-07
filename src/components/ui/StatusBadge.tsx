
import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'completed'
  | 'fulfilled'
  | 'rejected'
  | 'seen'
  | 'accepted';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span className={cn(`status-badge status-${status}`, className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};


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
  | 'accepted'
  | 'pending'
  | 'paid'
  | 'overdue';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Map status to classes
  const getStatusClasses = (status: StatusType) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    const statusClasses: Record<StatusType, string> = {
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      fulfilled: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      seen: "bg-blue-100 text-blue-800",
      accepted: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    return `${baseClasses} ${statusClasses[status]}`;
  };
  
  return (
    <span className={cn(getStatusClasses(status), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

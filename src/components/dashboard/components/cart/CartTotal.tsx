
import React from 'react';
import { Button } from '@/components/ui/button';
import { SheetFooter } from "@/components/ui/sheet";
import { useFormContext } from 'react-hook-form';

interface CartTotalProps {
  total: number;
  onClear: () => void;
  isSubmitting: boolean;
}

export const CartTotal: React.FC<CartTotalProps> = ({ total, onClear, isSubmitting }) => {
  const formContext = useFormContext();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Total:</span>
      <span className="font-bold">${total.toLocaleString()}</span>
    </div>
  );
};

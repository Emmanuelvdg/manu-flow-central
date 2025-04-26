
import React from 'react';
import { Button } from '@/components/ui/button';
import { SheetFooter } from "@/components/ui/sheet";

interface CartTotalProps {
  total: number;
  onClear: () => void;
  isSubmitting: boolean;
}

export const CartTotal: React.FC<CartTotalProps> = ({ total, onClear, isSubmitting }) => {
  return (
    <SheetFooter className="pt-4 border-t">
      <div className="w-full space-y-4">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold">${total.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={onClear}
            disabled={isSubmitting}
          >
            Clear All
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create RFQ"}
          </Button>
        </div>
      </div>
    </SheetFooter>
  );
};

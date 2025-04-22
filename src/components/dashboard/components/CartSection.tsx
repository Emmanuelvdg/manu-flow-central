
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '../types/product';
import { useToast } from '@/hooks/use-toast';
import { RFQInfoDialog } from './RFQInfoDialog';

interface CartSectionProps {
  cartItems: Product[];
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({ 
  cartItems, 
  onRemoveItem, 
  onClearCart 
}) => {
  const { toast } = useToast();
  const [showRFQDialog, setShowRFQDialog] = useState(false);

  const handleRFQSubmit = (info: any) => {
    toast({
      title: "RFQ Created",
      description: `Quote request for ${info.companyName} with ${cartItems.length} items has been submitted.`,
    });
    setShowRFQDialog(false);
    onClearCart();
  };

  if (cartItems.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Your RFQ Items ({cartItems.length})</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearCart}
          >
            Clear All
          </Button>
        </div>
        
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded"
                />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium">${item.price.toLocaleString()}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <span className="font-semibold">Total Items:</span>
          <span className="font-semibold">{cartItems.length}</span>
        </div>
        
        <Button 
          className="w-full"
          size="lg"
          onClick={() => setShowRFQDialog(true)}
        >
          Submit RFQ
        </Button>
      </div>

      <RFQInfoDialog 
        isOpen={showRFQDialog}
        onClose={() => setShowRFQDialog(false)}
        onSubmit={handleRFQSubmit}
      />
    </>
  );
};

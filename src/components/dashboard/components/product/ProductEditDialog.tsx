
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { EditProductForm } from '../../EditProductForm';
import { Product } from '../../types/product';

interface ProductEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onClose: () => void;
}

export const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  isOpen,
  onOpenChange,
  product,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product. The image URL will be saved with your changes.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm 
          product={product} 
          onClose={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};


import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Material } from "@/types/material";
import { MaterialForm } from '../MaterialForm';

interface MaterialEditFormProps {
  material: Material;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MaterialEditForm: React.FC<MaterialEditFormProps> = ({
  material,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <MaterialForm formData={material} handleChange={onChange} />
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};

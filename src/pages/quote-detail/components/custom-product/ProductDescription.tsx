
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ProductDescriptionProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  show: boolean;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  onChange,
  show
}) => {
  if (!show) return null;
  
  return (
    <Textarea
      placeholder="Product description"
      value={description || ""}
      onChange={onChange}
      className="mt-2"
      rows={3}
    />
  );
};

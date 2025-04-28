
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { VariantType } from '../../../types/product';

interface VariantAttributesProps {
  attributes: Record<string, string>;
  variantTypes: VariantType[];
}

export const VariantAttributes: React.FC<VariantAttributesProps> = ({
  attributes,
  variantTypes
}) => {
  return (
    <>
      {variantTypes.map(type => (
        <td key={type.name}>
          <Badge variant="outline">
            {attributes[type.name] || '-'}
          </Badge>
        </td>
      ))}
    </>
  );
};

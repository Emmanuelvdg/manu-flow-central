
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PublicProductCatalog } from '@/components/public/ProductCatalog';

const PublicProducts: React.FC = () => {
  return (
    <PublicLayout>
      <PublicProductCatalog />
    </PublicLayout>
  );
};

export default PublicProducts;


import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCatalog } from '@/components/dashboard/ProductCatalog';

const Products = () => {
  return (
    <MainLayout title="Products">
      <ProductCatalog />
    </MainLayout>
  );
};

export default Products;

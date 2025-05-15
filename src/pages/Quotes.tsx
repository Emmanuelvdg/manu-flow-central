
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuotesList } from '@/components/dashboard/QuotesList';

const Quotes = () => {
  return (
    <MainLayout title="Quotes">
      <QuotesList />
    </MainLayout>
  );
};

export default Quotes;

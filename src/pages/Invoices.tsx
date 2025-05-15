
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceList } from '@/components/dashboard/InvoiceList';

const Invoices = () => {
  return (
    <MainLayout title="Invoices">
      <InvoiceList />
    </MainLayout>
  );
};

export default Invoices;

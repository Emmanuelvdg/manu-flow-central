
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RFQList } from '@/components/dashboard/RFQList';

const RFQs = () => {
  return (
    <MainLayout title="Request For Quotes">
      <RFQList />
    </MainLayout>
  );
};

export default RFQs;

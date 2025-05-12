
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ThankYouPage } from '@/components/public/ThankYouPage';

const PublicThankYou: React.FC = () => {
  return (
    <PublicLayout>
      <ThankYouPage />
    </PublicLayout>
  );
};

export default PublicThankYou;

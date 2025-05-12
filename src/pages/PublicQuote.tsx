
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { QuoteRequestForm } from '@/components/public/QuoteRequestForm';
import { useCart } from '@/components/dashboard/hooks/useCart';

const PublicQuote: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  
  const handleFormSubmit = () => {
    clearCart();
  };
  
  return (
    <PublicLayout>
      <QuoteRequestForm 
        cartItems={cartItems}
        onFormSubmit={handleFormSubmit}
      />
    </PublicLayout>
  );
};

export default PublicQuote;

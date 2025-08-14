import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FXSettings } from '@/components/admin/FXSettings';
import { AuthGuard } from '@/components/auth/AuthGuard';

const FXManagement = () => {
  return (
    <AuthGuard>
      <MainLayout title="Foreign Exchange Management">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Foreign Exchange Management</h1>
            <p className="text-muted-foreground">
              Configure base currency and exchange rates for multi-currency operations.
            </p>
          </div>
          <FXSettings />
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default FXManagement;
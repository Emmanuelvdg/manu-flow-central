
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicSiteConfigForm } from '@/components/admin/PublicSiteConfigForm';
import { PublicSitePreview } from '@/components/admin/PublicSitePreview';
import { PublicSiteConfigProvider } from '@/contexts/PublicSiteConfigContext';

const PublicSiteConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('edit');

  return (
    <MainLayout title="Public Site Configuration">
      <PublicSiteConfigProvider>
        <div className="container px-4 py-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Public Site Configuration</h1>
          
          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="edit">Edit Configuration</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Configure Public Site</CardTitle>
                  <CardDescription>
                    Customize how your public-facing website appears to customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicSiteConfigForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Site Preview</CardTitle>
                  <CardDescription>
                    Preview how your public site will appear to visitors
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <PublicSitePreview />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PublicSiteConfigProvider>
    </MainLayout>
  );
};

export default PublicSiteConfig;

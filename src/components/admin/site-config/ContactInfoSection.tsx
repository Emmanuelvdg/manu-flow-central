
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

export const ContactInfoSection: React.FC = () => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={config.contactInfo?.email || ''}
            onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, email: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone</Label>
          <Input
            id="contactPhone"
            value={config.contactInfo?.phone || ''}
            onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, phone: e.target.value } })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contactAddress">Address</Label>
          <Textarea
            id="contactAddress"
            value={config.contactInfo?.address || ''}
            onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, address: e.target.value } })}
            rows={3}
          />
        </div>
      </div>
    </section>
  );
};

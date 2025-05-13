
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

export const BannerSection: React.FC = () => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Banner</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="bannerEnabled" className="text-sm">Enable Banner</Label>
          <Switch
            id="bannerEnabled"
            checked={config.banner?.enabled || false}
            onCheckedChange={(checked) => updateConfig({ banner: { ...config.banner, enabled: checked } })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bannerText">Banner Text</Label>
          <Input
            id="bannerText"
            value={config.banner?.text || ''}
            onChange={(e) => updateConfig({ banner: { ...config.banner, text: e.target.value } })}
            disabled={!config.banner?.enabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerBgColor">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bannerBgColor"
              type="color"
              value={config.banner?.backgroundColor || '#1A1F2C'}
              onChange={(e) => updateConfig({ banner: { ...config.banner, backgroundColor: e.target.value } })}
              disabled={!config.banner?.enabled}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.banner?.backgroundColor || '#1A1F2C'}
              onChange={(e) => updateConfig({ banner: { ...config.banner, backgroundColor: e.target.value } })}
              disabled={!config.banner?.enabled}
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerTextColor">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bannerTextColor"
              type="color"
              value={config.banner?.textColor || '#FFFFFF'}
              onChange={(e) => updateConfig({ banner: { ...config.banner, textColor: e.target.value } })}
              disabled={!config.banner?.enabled}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.banner?.textColor || '#FFFFFF'}
              onChange={(e) => updateConfig({ banner: { ...config.banner, textColor: e.target.value } })}
              disabled={!config.banner?.enabled}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

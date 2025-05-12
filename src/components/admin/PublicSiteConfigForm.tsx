
import React from 'react';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus } from 'lucide-react';

export const PublicSiteConfigForm: React.FC = () => {
  const { config, updateConfig, resetConfig } = usePublicSiteConfig();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Configuration saved',
      description: 'Your public site configuration has been saved.',
    });
  };

  const handleAddSocialMedia = () => {
    updateConfig({
      socialMedia: [
        ...config.socialMedia,
        {
          platform: '',
          url: '',
          icon: 'Link',
        },
      ],
    });
  };

  const handleRemoveSocialMedia = (index: number) => {
    updateConfig({
      socialMedia: config.socialMedia.filter((_, i) => i !== index),
    });
  };

  const handleSocialMediaChange = (index: number, key: keyof typeof config.socialMedia[0], value: string) => {
    const updatedSocialMedia = [...config.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [key]: value,
    };
    updateConfig({ socialMedia: updatedSocialMedia });
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={config.companyName}
              onChange={(e) => updateConfig({ companyName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={config.logo}
              onChange={(e) => updateConfig({ logo: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="layout">Layout Style</Label>
            <select
              id="layout"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={config.layout}
              onChange={(e) => updateConfig({ layout: e.target.value as 'grid' | 'list' })}
            >
              <option value="grid">Grid Layout</option>
              <option value="list">List Layout</option>
            </select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Banner Configuration */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Banner</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="bannerEnabled" className="text-sm">Enable Banner</Label>
            <Switch
              id="bannerEnabled"
              checked={config.banner.enabled}
              onCheckedChange={(checked) => updateConfig({ banner: { ...config.banner, enabled: checked } })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bannerText">Banner Text</Label>
            <Input
              id="bannerText"
              value={config.banner.text}
              onChange={(e) => updateConfig({ banner: { ...config.banner, text: e.target.value } })}
              disabled={!config.banner.enabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bannerBgColor">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="bannerBgColor"
                type="color"
                value={config.banner.backgroundColor}
                onChange={(e) => updateConfig({ banner: { ...config.banner, backgroundColor: e.target.value } })}
                disabled={!config.banner.enabled}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.banner.backgroundColor}
                onChange={(e) => updateConfig({ banner: { ...config.banner, backgroundColor: e.target.value } })}
                disabled={!config.banner.enabled}
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
                value={config.banner.textColor}
                onChange={(e) => updateConfig({ banner: { ...config.banner, textColor: e.target.value } })}
                disabled={!config.banner.enabled}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.banner.textColor}
                onChange={(e) => updateConfig({ banner: { ...config.banner, textColor: e.target.value } })}
                disabled={!config.banner.enabled}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Color Scheme */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primaryColor"
                type="color"
                value={config.colorScheme.primary.startsWith('hsl') ? '#1e40af' : config.colorScheme.primary}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, primary: e.target.value } })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.colorScheme.primary}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, primary: e.target.value } })}
                placeholder="e.g., #1e40af or hsl(var(--primary))"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="secondaryColor"
                type="color"
                value={config.colorScheme.secondary.startsWith('hsl') ? '#94a3b8' : config.colorScheme.secondary}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, secondary: e.target.value } })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.colorScheme.secondary}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, secondary: e.target.value } })}
                placeholder="e.g., #94a3b8 or hsl(var(--secondary))"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="accentColor"
                type="color"
                value={config.colorScheme.accent.startsWith('hsl') ? '#10b981' : config.colorScheme.accent}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, accent: e.target.value } })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.colorScheme.accent}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, accent: e.target.value } })}
                placeholder="e.g., #10b981 or hsl(var(--accent))"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="backgroundColor"
                type="color"
                value={config.colorScheme.background.startsWith('hsl') ? '#ffffff' : config.colorScheme.background}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, background: e.target.value } })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.colorScheme.background}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, background: e.target.value } })}
                placeholder="e.g., #ffffff or hsl(var(--background))"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="textColor"
                type="color"
                value={config.colorScheme.text.startsWith('hsl') ? '#333333' : config.colorScheme.text}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, text: e.target.value } })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={config.colorScheme.text}
                onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, text: e.target.value } })}
                placeholder="e.g., #333333 or hsl(var(--foreground))"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Contact Information */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={config.contactInfo.email}
              onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, email: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              value={config.contactInfo.phone}
              onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, phone: e.target.value } })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactAddress">Address</Label>
            <Textarea
              id="contactAddress"
              value={config.contactInfo.address}
              onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, address: e.target.value } })}
              rows={3}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Social Media */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          <Button variant="outline" size="sm" onClick={handleAddSocialMedia} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        
        <div className="space-y-4">
          {config.socialMedia.map((social, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Platform (e.g., Twitter)"
                  value={social.platform}
                  onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={social.url}
                  onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                  className="md:col-span-2"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveSocialMedia(index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={resetConfig}>Reset to Default</Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};

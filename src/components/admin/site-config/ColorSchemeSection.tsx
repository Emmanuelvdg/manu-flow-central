
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

export const ColorSchemeSection: React.FC = () => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="primaryColor"
              type="color"
              value={config.colorScheme?.primary.startsWith('hsl') ? '#1e40af' : config.colorScheme?.primary || '#1e40af'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, primary: e.target.value } })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.colorScheme?.primary || 'hsl(var(--primary))'}
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
              value={config.colorScheme?.secondary.startsWith('hsl') ? '#94a3b8' : config.colorScheme?.secondary || '#94a3b8'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, secondary: e.target.value } })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.colorScheme?.secondary || 'hsl(var(--secondary))'}
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
              value={config.colorScheme?.accent.startsWith('hsl') ? '#10b981' : config.colorScheme?.accent || '#10b981'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, accent: e.target.value } })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.colorScheme?.accent || 'hsl(var(--accent))'}
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
              value={config.colorScheme?.background.startsWith('hsl') ? '#ffffff' : config.colorScheme?.background || '#ffffff'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, background: e.target.value } })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.colorScheme?.background || 'hsl(var(--background))'}
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
              value={config.colorScheme?.text.startsWith('hsl') ? '#333333' : config.colorScheme?.text || '#333333'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, text: e.target.value } })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={config.colorScheme?.text || 'hsl(var(--foreground))'}
              onChange={(e) => updateConfig({ colorScheme: { ...config.colorScheme, text: e.target.value } })}
              placeholder="e.g., #333333 or hsl(var(--foreground))"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

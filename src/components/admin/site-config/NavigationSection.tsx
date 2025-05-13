
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Trash2, Plus, Link } from 'lucide-react';

export const NavigationSection: React.FC = () => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  // Ensure we have default values for arrays to prevent map errors
  const navigationLinks = config.navigationLinks || [];
  
  const handleAddNavigationLink = () => {
    updateConfig({
      navigationLinks: [
        ...(config.navigationLinks || []),
        {
          label: '',
          url: '',
        },
      ],
    });
  };

  const handleRemoveNavigationLink = (index: number) => {
    if (!config.navigationLinks) return;
    
    updateConfig({
      navigationLinks: config.navigationLinks.filter((_, i) => i !== index),
    });
  };

  const handleNavigationLinkChange = (index: number, key: keyof typeof navigationLinks[0], value: string) => {
    if (!config.navigationLinks) return;
    
    const updatedNavigationLinks = [...config.navigationLinks];
    updatedNavigationLinks[index] = {
      ...updatedNavigationLinks[index],
      [key]: value,
    };
    updateConfig({ navigationLinks: updatedNavigationLinks });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Navigation Menu</h3>
        <Button variant="outline" size="sm" onClick={handleAddNavigationLink} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Link
        </Button>
      </div>
      
      <div className="space-y-4">
        {navigationLinks.map((navLink, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Label (e.g., Home, About Us)"
                value={navLink.label}
                onChange={(e) => handleNavigationLinkChange(index, 'label', e.target.value)}
              />
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="URL (e.g., /public, /about)"
                  value={navLink.url}
                  onChange={(e) => handleNavigationLinkChange(index, 'url', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleRemoveNavigationLink(index)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {navigationLinks.length === 0 && (
          <div className="text-center py-4 border border-dashed rounded-md text-muted-foreground">
            No navigation links added. Click "Add Link" to create menu items.
          </div>
        )}
      </div>
    </section>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Trash2, Plus } from 'lucide-react';

export const SocialMediaSection: React.FC = () => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  // Ensure we have default values for arrays to prevent map errors
  const socialMedia = config.socialMedia || [];
  
  const handleAddSocialMedia = () => {
    updateConfig({
      socialMedia: [
        ...(config.socialMedia || []),
        {
          platform: '',
          url: '',
          icon: 'Link',
        },
      ],
    });
  };

  const handleRemoveSocialMedia = (index: number) => {
    if (!config.socialMedia) return;
    
    updateConfig({
      socialMedia: config.socialMedia.filter((_, i) => i !== index),
    });
  };

  const handleSocialMediaChange = (index: number, key: keyof typeof socialMedia[0], value: string) => {
    if (!config.socialMedia) return;
    
    const updatedSocialMedia = [...config.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [key]: value,
    };
    updateConfig({ socialMedia: updatedSocialMedia });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Social Media</h3>
        <Button variant="outline" size="sm" onClick={handleAddSocialMedia} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      
      <div className="space-y-4">
        {socialMedia.map((social, index) => (
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

        {socialMedia.length === 0 && (
          <div className="text-center py-4 border border-dashed rounded-md text-muted-foreground">
            No social media links added. Click "Add" to create social media links.
          </div>
        )}
      </div>
    </section>
  );
};

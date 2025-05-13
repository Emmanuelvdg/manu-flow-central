
import React, { useState, useEffect } from 'react';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { ensureStorageBucket } from '@/integrations/supabase/storage';

// Import section components
import { GeneralSettingsSection } from './site-config/GeneralSettingsSection';
import { BannerSection } from './site-config/BannerSection';
import { NavigationSection } from './site-config/NavigationSection';
import { ColorSchemeSection } from './site-config/ColorSchemeSection';
import { ContactInfoSection } from './site-config/ContactInfoSection';
import { SocialMediaSection } from './site-config/SocialMediaSection';
import { ActionButtons } from './site-config/ActionButtons';

export const PublicSiteConfigForm: React.FC = () => {
  const { uploadLogo } = usePublicSiteConfig();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    // Check if storage bucket is ready on component mount
    async function checkStorage() {
      setCheckingStorage(true);
      try {
        const ready = await ensureStorageBucket('website_assets');
        setStorageReady(ready);
        if (!ready) {
          setStorageError('Storage bucket not available. Please ensure the website_assets bucket exists in Supabase and has proper public access permissions.');
        } else {
          setStorageError(null);
        }
      } catch (error) {
        console.error('Error checking storage:', error);
        setStorageError('Failed to check storage status. Please check your Supabase configuration.');
        setStorageReady(false);
      } finally {
        setCheckingStorage(false);
      }
    }
    
    checkStorage();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPEG, PNG, GIF, WEBP, SVG)',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Logo image must be smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setStorageError(null);
      await uploadLogo(file);
    } catch (error: any) {
      console.error('Upload error:', error);
      setStorageError(error.message || 'An unknown error occurred');
      // Error is already handled in uploadLogo function
    } finally {
      setUploading(false);
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleSave = () => {
    toast({
      title: 'Configuration saved',
      description: 'Your public site configuration has been saved.',
    });
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <GeneralSettingsSection 
        uploading={uploading}
        storageReady={storageReady}
        storageError={storageError}
        checkingStorage={checkingStorage}
        onLogoUpload={handleLogoUpload}
      />

      <Separator />

      {/* Banner Configuration */}
      <BannerSection />

      <Separator />

      {/* Navigation Links */}
      <NavigationSection />

      <Separator />

      {/* Color Scheme */}
      <ColorSchemeSection />

      <Separator />

      {/* Contact Information */}
      <ContactInfoSection />

      <Separator />

      {/* Social Media */}
      <SocialMediaSection />

      {/* Action Buttons */}
      <ActionButtons onSave={handleSave} />
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ensureStorageBucket, uploadToStorage } from '@/integrations/supabase/storage';

export interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface PublicSiteConfig {
  companyName: string;
  logo: {
    path: string;
    filename: string;
  };
  banner: {
    text: string;
    backgroundColor: string;
    textColor: string;
    enabled: boolean;
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  contactInfo: ContactInfo;
  socialMedia: SocialMediaLink[];
  layout: 'grid' | 'list';
}

const defaultConfig: PublicSiteConfig = {
  companyName: 'Labamu Manufacturing',
  logo: {
    path: '/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png',
    filename: 'labamu-logo.png'
  },
  banner: {
    text: 'Welcome to our online catalog',
    backgroundColor: '#1A1F2C',
    textColor: '#FFFFFF',
    enabled: true,
  },
  colorScheme: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    text: 'hsl(var(--foreground))',
  },
  contactInfo: {
    email: 'contact@labamumanufacturing.com',
    phone: '+1 (555) 123-4567',
    address: '123 Manufacturing Way, Industry City, CA 90210',
  },
  socialMedia: [
    {
      platform: 'Twitter',
      url: 'https://twitter.com/labamu',
      icon: 'Twitter',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/company/labamu',
      icon: 'Linkedin',
    },
    {
      platform: 'Facebook',
      url: 'https://facebook.com/labamu',
      icon: 'Facebook',
    },
  ],
  layout: 'grid',
};

interface PublicSiteConfigContextType {
  config: PublicSiteConfig;
  updateConfig: (newConfig: Partial<PublicSiteConfig>) => void;
  resetConfig: () => void;
  uploadLogo: (file: File) => Promise<void>;
}

const PublicSiteConfigContext = createContext<PublicSiteConfigContextType | undefined>(undefined);

export const PublicSiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PublicSiteConfig>(() => {
    const savedConfig = localStorage.getItem('publicSiteConfig');
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('publicSiteConfig', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<PublicSiteConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      banner: {
        ...prev.banner,
        ...(newConfig.banner || {}),
      },
      colorScheme: {
        ...prev.colorScheme,
        ...(newConfig.colorScheme || {}),
      },
      contactInfo: {
        ...prev.contactInfo,
        ...(newConfig.contactInfo || {}),
      },
      logo: {
        ...prev.logo,
        ...(newConfig.logo || {}),
      },
    }));
  };

  const uploadLogo = async (file: File) => {
    try {
      const BUCKET_NAME = 'website_assets';
      
      // Check if storage bucket is available
      const storageReady = await ensureStorageBucket(BUCKET_NAME);
      
      if (!storageReady) {
        throw new Error(`Storage bucket ${BUCKET_NAME} not available. Please ensure the ${BUCKET_NAME} bucket exists in Supabase and has proper public access.`);
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Use our improved upload function
      const publicUrl = await uploadToStorage(BUCKET_NAME, filePath, file);
      
      updateConfig({
        logo: {
          path: publicUrl,
          filename: file.name
        }
      });
      
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully',
      });
      
    } catch (error: any) {
      console.error('Error in uploadLogo:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred while uploading the logo',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <PublicSiteConfigContext.Provider value={{ config, updateConfig, resetConfig, uploadLogo }}>
      {children}
    </PublicSiteConfigContext.Provider>
  );
};

export const usePublicSiteConfig = () => {
  const context = useContext(PublicSiteConfigContext);
  if (context === undefined) {
    throw new Error('usePublicSiteConfig must be used within a PublicSiteConfigProvider');
  }
  return context;
};

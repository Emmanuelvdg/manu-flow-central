
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  logo: string;
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
  logo: '/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png',
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
    }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <PublicSiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
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

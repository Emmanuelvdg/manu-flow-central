
import React from 'react';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Button } from '@/components/ui/button';

export const PublicSitePreview: React.FC = () => {
  const { config } = usePublicSiteConfig();
  const { colorScheme, companyName, logo, banner, contactInfo, navigationLinks } = config;

  // Apply dynamic styles based on configuration
  const headerStyle = {
    backgroundColor: colorScheme?.background || 'hsl(var(--background))',
    color: colorScheme?.text || 'hsl(var(--foreground))',
  };

  const primaryButtonStyle = {
    backgroundColor: colorScheme?.primary || 'hsl(var(--primary))',
    color: colorScheme?.primary === 'hsl(var(--primary))' ? 'hsl(var(--primary-foreground))' : '#ffffff',
  };

  return (
    <div className="w-full bg-gray-50 border rounded-md overflow-hidden" style={{ backgroundColor: colorScheme?.background || 'hsl(var(--background))' }}>
      {/* Banner */}
      {banner?.enabled && (
        <div 
          className="py-2 text-center text-sm font-medium" 
          style={{ backgroundColor: banner?.backgroundColor || '#1A1F2C', color: banner?.textColor || '#FFFFFF' }}
        >
          {banner?.text || ''}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm p-4" style={headerStyle}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={logo?.path || '/placeholder.svg'} 
              alt={companyName} 
              className="h-8 w-auto"
            />
            <span className="ml-3 text-xl font-medium" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>{companyName}</span>
          </div>
          <nav className="flex items-center space-x-4">
            {navigationLinks && navigationLinks.map((navLink, index) => (
              <Button key={index} variant="ghost" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>
                {navLink.label}
              </Button>
            ))}
            <Button style={primaryButtonStyle}>Login</Button>
          </nav>
        </div>
      </header>

      {/* Main content preview */}
      <main className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Our Products</h1>
          <p className="mt-4 text-lg" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>
            Browse our product catalog and request quotes for items you're interested in.
          </p>
        </div>
        
        {/* Mock products grid/list */}
        <div className={config.layout === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-4'}>
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`rounded-lg p-4 border ${config.layout === 'list' ? 'flex items-center gap-4' : ''}`} 
              style={{ borderColor: `${colorScheme?.text || 'hsl(var(--foreground))'}20`, backgroundColor: `${colorScheme?.background === '#ffffff' ? '#f9fafb' : colorScheme?.background || 'hsl(var(--background))'}` }}
            >
              <div className={`aspect-square ${config.layout === 'list' ? 'h-16 w-16' : 'w-full'} rounded bg-gray-200`}></div>
              <div className={config.layout === 'list' ? 'flex-1' : 'mt-4'}>
                <h3 className="font-medium" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Product {i}</h3>
                <p className="text-sm mt-1" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}80` }}>Product description here</p>
                {config.layout === 'list' && <Button className="mt-2" size="sm" style={primaryButtonStyle}>Add to Quote</Button>}
                {config.layout === 'grid' && <Button className="mt-3 w-full" size="sm" style={primaryButtonStyle}>Add to Quote</Button>}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t p-6" style={{ borderColor: `${colorScheme?.text || 'hsl(var(--foreground))'}20`, backgroundColor: headerStyle.backgroundColor }}>
        <div className="grid grid-cols-3 gap-4">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>{companyName}</h3>
            <p className="text-sm" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>{contactInfo?.address || ''}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Contact Us</h3>
            <p className="text-sm" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>Email: {contactInfo?.email || ''}</p>
            <p className="text-sm" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>Phone: {contactInfo?.phone || ''}</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Follow Us</h3>
            <div className="flex space-x-3">
              {config.socialMedia && config.socialMedia.map((social) => (
                <div 
                  key={social.platform}
                  className="text-sm"
                  style={{ color: colorScheme?.primary || 'hsl(var(--primary))' }}
                >
                  {social.platform}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

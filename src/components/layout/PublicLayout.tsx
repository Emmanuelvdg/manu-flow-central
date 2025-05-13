
import React from 'react';
import { Link } from 'react-router-dom';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { config } = usePublicSiteConfig();
  const { colorScheme, companyName, logo, banner, contactInfo, socialMedia, navigationLinks } = config;

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
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: colorScheme?.background || 'hsl(var(--background))' }}>
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
      <header className="bg-white shadow-sm" style={headerStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={logo?.path || '/placeholder.svg'} 
                alt={companyName} 
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-medium" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>{companyName}</span>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              {navigationLinks && navigationLinks.map((navLink, index) => (
                <Link 
                  key={index} 
                  to={navLink.url} 
                  className="hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" 
                  style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}
                >
                  {navLink.label}
                </Link>
              ))}
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white" style={primaryButtonStyle}>
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto" style={{ borderColor: `${colorScheme?.text || 'hsl(var(--foreground))'}20`, backgroundColor: headerStyle.backgroundColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>{companyName}</h3>
              <p className="text-sm mb-2" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>{contactInfo?.address || ''}</p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Contact Us</h3>
              <p className="text-sm mb-2" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>Email: {contactInfo?.email || ''}</p>
              <p className="text-sm mb-2" style={{ color: `${colorScheme?.text || 'hsl(var(--foreground))'}99` }}>Phone: {contactInfo?.phone || ''}</p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colorScheme?.text || 'hsl(var(--foreground))' }}>Follow Us</h3>
              <div className="flex space-x-4">
                {socialMedia && socialMedia.map((social) => (
                  <a 
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: colorScheme?.primary || 'hsl(var(--primary))' }}
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="py-4 text-center text-sm border-t" style={{ borderColor: `${colorScheme?.text || 'hsl(var(--foreground))'}10`, color: `${colorScheme?.text || 'hsl(var(--foreground))'}80` }}>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

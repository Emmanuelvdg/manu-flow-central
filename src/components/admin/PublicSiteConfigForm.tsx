import React, { useState, useEffect } from 'react';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus, Upload, Image, Loader2, AlertCircle, Link } from 'lucide-react';
import { ensureStorageBucket } from '@/integrations/supabase/storage';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PublicSiteConfigForm: React.FC = () => {
  const { config, updateConfig, resetConfig, uploadLogo } = usePublicSiteConfig();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  // Ensure we have default values for arrays to prevent map errors
  const navigationLinks = config.navigationLinks || [];
  const socialMedia = config.socialMedia || [];

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

  const handleSave = () => {
    toast({
      title: 'Configuration saved',
      description: 'Your public site configuration has been saved.',
    });
  };

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

  const handleSocialMediaChange = (index: number, key: keyof typeof config.socialMedia[0], value: string) => {
    if (!config.socialMedia) return;
    
    const updatedSocialMedia = [...config.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [key]: value,
    };
    updateConfig({ socialMedia: updatedSocialMedia });
  };

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

  const handleNavigationLinkChange = (index: number, key: keyof typeof config.navigationLinks[0], value: string) => {
    if (!config.navigationLinks) return;
    
    const updatedNavigationLinks = [...config.navigationLinks];
    updatedNavigationLinks[index] = {
      ...updatedNavigationLinks[index],
      [key]: value,
    };
    updateConfig({ navigationLinks: updatedNavigationLinks });
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
            <Label htmlFor="logo">Logo</Label>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                  {config.logo && config.logo.path ? (
                    <img 
                      src={config.logo.path} 
                      alt="Company Logo" 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        // Handle image loading error
                        e.currentTarget.src = '/placeholder.svg';
                        console.error('Logo image failed to load');
                      }}
                    />
                  ) : (
                    <Image className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{config.logo?.filename || 'No file selected'}</p>
                  {config.logo?.path && (
                    <p className="text-xs text-gray-500 truncate">
                      {config.logo.path.substring(config.logo.path.lastIndexOf('/') + 1)}
                    </p>
                  )}
                </div>
              </div>
              
              {checkingStorage && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Checking storage access...</span>
                </div>
              )}
              
              {storageError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {storageError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  disabled={uploading || !storageReady || checkingStorage}
                  className="relative"
                  asChild
                >
                  <label className="cursor-pointer flex items-center">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading || !storageReady || checkingStorage}
                    />
                  </label>
                </Button>
                
                {config.logo && config.logo.path && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateConfig({ logo: { path: '', filename: '' }})}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                )}
              </div>
            </div>
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

      <Separator />

      {/* Navigation Links */}
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
              value={config.contactInfo?.email || ''}
              onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, email: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              value={config.contactInfo?.phone || ''}
              onChange={(e) => updateConfig({ contactInfo: { ...config.contactInfo, phone: e.target.value } })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactAddress">Address</Label>
            <Textarea
              id="contactAddress"
              value={config.contactInfo?.address || ''}
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

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={resetConfig}>Reset to Default</Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};

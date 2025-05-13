
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { Image, Loader2, AlertCircle, Upload, Trash2 } from 'lucide-react';

interface GeneralSettingsSectionProps {
  uploading: boolean;
  storageReady: boolean;
  storageError: string | null;
  checkingStorage: boolean;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({
  uploading,
  storageReady,
  storageError,
  checkingStorage,
  onLogoUpload
}) => {
  const { config, updateConfig } = usePublicSiteConfig();
  
  return (
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
                    onChange={onLogoUpload}
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
  );
};

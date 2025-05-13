
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePublicSiteConfig } from '@/contexts/PublicSiteConfigContext';
import { useToast } from '@/components/ui/use-toast';

interface ActionButtonsProps {
  onSave?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave }) => {
  const { resetConfig } = usePublicSiteConfig();
  const { toast } = useToast();
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      toast({
        title: 'Configuration saved',
        description: 'Your public site configuration has been saved.',
      });
    }
  };
  
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button variant="outline" onClick={resetConfig}>Reset to Default</Button>
      <Button onClick={handleSave}>Save Configuration</Button>
    </div>
  );
};

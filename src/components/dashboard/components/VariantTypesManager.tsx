
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { VariantType } from '../types/product';

interface VariantTypesManagerProps {
  variantTypes: VariantType[];
  onChange: (variantTypes: VariantType[]) => void;
  disabled?: boolean;
}

export function VariantTypesManager({ 
  variantTypes, 
  onChange, 
  disabled = false 
}: VariantTypesManagerProps) {
  const [newTypeName, setNewTypeName] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [newOptionValue, setNewOptionValue] = useState("");
  
  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    
    const updatedTypes = [
      ...variantTypes,
      { name: newTypeName.trim(), options: [] }
    ];
    onChange(updatedTypes);
    setNewTypeName("");
    // Auto-set to editing mode for the new type
    setEditingType(newTypeName.trim());
  };
  
  const handleRemoveType = (typeName: string) => {
    const updatedTypes = variantTypes.filter(t => t.name !== typeName);
    onChange(updatedTypes);
    if (editingType === typeName) {
      setEditingType(null);
    }
  };
  
  const handleAddOption = (typeName: string) => {
    if (!newOptionValue.trim()) return;
    
    const updatedTypes = variantTypes.map(type => {
      if (type.name === typeName) {
        return {
          ...type,
          options: [...type.options, newOptionValue.trim()]
        };
      }
      return type;
    });
    
    onChange(updatedTypes);
    setNewOptionValue("");
  };
  
  const handleRemoveOption = (typeName: string, option: string) => {
    const updatedTypes = variantTypes.map(type => {
      if (type.name === typeName) {
        return {
          ...type,
          options: type.options.filter(o => o !== option)
        };
      }
      return type;
    });
    
    onChange(updatedTypes);
  };
  
  return (
    <div className="space-y-4">
      <div className="font-medium">Product Variant Types</div>
      <p className="text-sm text-muted-foreground mb-2">
        Define up to 3 types of variants for this product (e.g., Color, Size, Material)
      </p>
      
      {variantTypes.length > 0 ? (
        <div className="space-y-3">
          {variantTypes.map((type) => (
            <Card key={type.name} className={editingType === type.name ? "border-primary" : ""}>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{type.name}</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingType(editingType === type.name ? null : type.name)}
                      disabled={disabled}
                    >
                      {editingType === type.name ? "Done" : "Edit"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveType(type.name)}
                      className="h-8 w-8 text-destructive"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Options display */}
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {type.options.map((option) => (
                      <Badge 
                        key={option} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {option}
                        {editingType === type.name && !disabled && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveOption(type.name, option)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Add option form */}
                {editingType === type.name && !disabled && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      placeholder={`Add ${type.name} option...`}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(type.name)}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          No variant types defined yet.
        </div>
      )}
      
      {variantTypes.length < 3 && !disabled && (
        <div className="flex gap-2 items-end mt-4">
          <div className="flex-1">
            <Label htmlFor="new-variant-type">Add Variant Type</Label>
            <Input
              id="new-variant-type"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="e.g. Color, Size, Material"
              disabled={disabled}
            />
          </div>
          <Button
            type="button"
            onClick={handleAddType}
            disabled={!newTypeName.trim() || disabled}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Type
          </Button>
        </div>
      )}
    </div>
  );
}


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, X, Upload, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RecipeMappingModal from "@/components/recipe/RecipeMappingModal";

export interface CustomProduct {
  id?: string;
  name: string;
  description?: string;
  documents?: any[];
}

interface CustomProductInputProps {
  product: CustomProduct;
  index: number;
  onChange: (product: CustomProduct) => void;
  onRemove: () => void;
}

export const CustomProductInput: React.FC<CustomProductInputProps> = ({
  product,
  index,
  onChange,
  onRemove
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>(product.documents || []);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...product, name: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...product, description: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleFileUpload = async () => {
    if (files.length === 0) return;
    
    const uploads = await Promise.all(
      files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `custom-products/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return null;
        }
        
        return {
          name: file.name,
          path: filePath,
          type: file.type,
          size: file.size
        };
      })
    );
    
    const validUploads = uploads.filter(Boolean);
    setUploadedFiles([...uploadedFiles, ...validUploads]);
    setFiles([]);
    
    onChange({
      ...product,
      documents: [...(product.documents || []), ...validUploads]
    });
  };
  
  const handleRemoveUploadedFile = (index: number) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);
    
    onChange({
      ...product,
      documents: newUploadedFiles
    });
  };

  const handleRecipeSuccess = () => {
    setShowRecipeModal(false);
  };
  
  return (
    <div className="space-y-3 p-3 border rounded bg-gray-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <Input
            placeholder="Custom product name"
            value={product.name}
            onChange={handleNameChange}
            className="font-medium"
          />
          
          {showDescription && (
            <Textarea
              placeholder="Product description"
              value={product.description || ""}
              onChange={handleDescriptionChange}
              className="mt-2"
              rows={3}
            />
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowDescription(!showDescription)}
        >
          <FileText className="h-4 w-4 mr-1" />
          {showDescription ? "Hide" : "Add"} Description
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-red-500"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          Remove
        </Button>
      </div>

      {/* Recipe mapping button */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowRecipeModal(true)}
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Recipe/Material Mapping
        </Button>
      </div>
      
      {/* File upload section */}
      <div className="border-t pt-2 mt-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
              <span>{file.name}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveUploadedFile(idx)}
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileChange}
            multiple
            className="text-sm"
          />
          {files.length > 0 && (
            <Button
              type="button"
              size="sm"
              onClick={handleFileUpload}
              variant="outline"
              className="whitespace-nowrap"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </Button>
          )}
        </div>
      </div>

      {/* Recipe mapping modal */}
      {showRecipeModal && (
        <RecipeMappingModal
          open={showRecipeModal}
          onClose={() => setShowRecipeModal(false)}
          onSuccess={handleRecipeSuccess}
          initialRecipe={null}
          customProduct={product}
          returnToQuote={true}
        />
      )}
    </div>
  );
};

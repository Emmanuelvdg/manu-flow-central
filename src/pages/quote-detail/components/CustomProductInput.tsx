
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import RecipeMappingModal from "@/components/recipe/RecipeMappingModal";
import { ProductHeader } from "./custom-product/ProductHeader";
import { ProductDescription } from "./custom-product/ProductDescription";
import { RecipeButton } from "./custom-product/RecipeButton";
import { FileUpload } from "./custom-product/FileUpload";
import { CustomProduct } from "./custom-product/types";

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
      <ProductHeader
        name={product.name}
        showDescription={showDescription}
        onNameChange={handleNameChange}
        onToggleDescription={() => setShowDescription(!showDescription)}
        onRemove={onRemove}
      />
      
      <ProductDescription
        description={product.description || ""}
        onChange={handleDescriptionChange}
        show={showDescription}
      />

      <RecipeButton onClick={() => setShowRecipeModal(true)} />
      
      <FileUpload
        files={files}
        uploadedFiles={uploadedFiles}
        onFileChange={handleFileChange}
        onUpload={handleFileUpload}
        onRemoveFile={handleRemoveUploadedFile}
      />

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

export type { CustomProduct };

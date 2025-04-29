
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  files: File[];
  uploadedFiles: any[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onRemoveFile: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  uploadedFiles,
  onFileChange,
  onUpload,
  onRemoveFile
}) => {
  return (
    <div className="border-t pt-2 mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {uploadedFiles.map((file, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
            <span>{file.name}</span>
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onRemoveFile(idx)}
            />
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          onChange={onFileChange}
          multiple
          className="text-sm"
        />
        {files.length > 0 && (
          <Button
            type="button"
            size="sm"
            onClick={onUpload}
            variant="outline"
            className="whitespace-nowrap"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload {files.length} {files.length === 1 ? 'file' : 'files'}
          </Button>
        )}
      </div>
    </div>
  );
};

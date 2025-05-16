
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, AlertCircle } from "lucide-react";
import { 
  parseFile, 
  generateMaterialsTemplate, 
  downloadFile, 
  generateRecipeMaterialsTemplate,
  generateRecipeMappingsTemplate
} from "@/utils/fileUtils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Material } from "@/types/material";

interface BulkUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (materials: Material[] | any[]) => void;
  templateType: 'materials' | 'recipe-materials' | 'recipe-mappings';
  existingMaterials: Material[];
}

export function BulkUploadDialog({
  open,
  onClose,
  onUploadComplete,
  templateType,
  existingMaterials
}: BulkUploadDialogProps) {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'validating' | 'processing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadStatus('parsing');
    setUploadProgress(10);
    setError(null);

    try {
      // Parse the file
      const data = await parseFile(selectedFile);
      setParsedData(data);
      setPreviewData(data.slice(0, 5)); // Show first 5 rows as preview
      setUploadStatus('validating');
      setUploadProgress(40);

      // Validate the data
      validateData(data);
      setUploadStatus('processing');
      setUploadProgress(70);

      // Process the data to match the Material interface
      const processedData = processData(data);
      setUploadProgress(100);
      setUploadStatus('complete');

      toast({
        title: "File processed successfully",
        description: `${data.length} items ready for import.`,
      });
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
      setUploadStatus('error');
      setUploadProgress(0);
      
      toast({
        title: "Error processing file",
        description: err.message || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const validateData = (data: any[]) => {
    let requiredFields: string[] = [];
    
    switch (templateType) {
      case 'materials':
        requiredFields = ['name', 'unit'];
        break;
      case 'recipe-materials':
        requiredFields = ['name', 'quantity', 'unit'];
        break;
      case 'recipe-mappings':
        requiredFields = ['product_id', 'name'];
        break;
    }
    
    // Check that all required fields are present in each row
    const missingFields = data.findIndex(row => {
      return requiredFields.some(field => !row[field]);
    });

    if (missingFields !== -1) {
      throw new Error(`Row ${missingFields + 1}: Missing required fields. Required: ${requiredFields.join(', ')}`);
    }
  };

  const processData = (data: any[]): any[] => {
    // Map CSV data based on template type
    switch (templateType) {
      case 'materials':
        return data.map((row, index) => ({
          id: `temp-${Date.now()}-${index}`,
          name: row.name,
          category: row.category || '',
          unit: row.unit,
          vendor: row.vendor || '',
          status: 'Active',
          costPerUnit: row.costPerUnit || 0,
          stock: row.quantity || 0
        }));

      case 'recipe-materials':
        return data.map((row, index) => ({
          id: `temp-${Date.now()}-${index}`,
          name: row.name,
          quantity: row.quantity || 1,
          unit: row.unit
        }));

      case 'recipe-mappings':
        return data.map((row) => ({
          product_id: row.product_id,
          product_name: row.product_name || row.product_id,
          name: row.name,
          description: row.description || '',
          materials: row.materials || [],
          routing_stages: row.routing_stages || []
        }));

      default:
        return data;
    }
  };

  const handleDownloadTemplate = () => {
    let template = '';
    let filename = '';
    
    switch (templateType) {
      case 'materials':
        template = generateMaterialsTemplate();
        filename = 'materials_template.csv';
        break;
      case 'recipe-materials':
        template = generateRecipeMaterialsTemplate();
        filename = 'recipe_materials_template.csv';
        break;
      case 'recipe-mappings':
        template = generateRecipeMappingsTemplate();
        filename = 'recipe_mappings_template.csv';
        break;
    }
    
    downloadFile(template, filename, 'text/csv');
  };

  const handleSubmit = () => {
    if (parsedData.length === 0) return;

    try {
      const processedData = processData(parsedData);
      onUploadComplete(processedData);
      toast({
        title: "Upload complete",
        description: `Successfully imported ${processedData.length} items.`,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
      toast({
        title: "Error completing upload",
        description: err.message || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Get dialog title based on template type
  const getDialogTitle = () => {
    switch (templateType) {
      case 'materials': return 'Bulk Upload Materials';
      case 'recipe-materials': return 'Bulk Upload Recipe Materials';
      case 'recipe-mappings': return 'Bulk Upload BOMs/Recipe Mappings';
      default: return 'Bulk Upload';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with {templateType === 'materials' ? 'materials data' : 
              templateType === 'recipe-materials' ? 'recipe materials data' : 'BOM mapping data'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadStatus !== 'idle' && uploadStatus !== 'error' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>
                  {uploadStatus === 'parsing' && 'Parsing file...'}
                  {uploadStatus === 'validating' && 'Validating data...'}
                  {uploadStatus === 'processing' && 'Processing data...'}
                  {uploadStatus === 'complete' && 'Processing complete'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {previewData.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Preview (First 5 rows)</h3>
              <div className="max-h-[200px] overflow-auto border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="p-2 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-t">
                        {Object.values(row).map((value: any, j) => (
                          <td key={j} className="p-2">{value?.toString() || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Upload File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={parsedData.length === 0 || uploadStatus !== 'complete'}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import {parsedData.length} Items
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Upload, Download, Trash2, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface DocumentUploadProps {
  shipmentId: string;
  documentType: string;
  title: string;
  description: string;
  required?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  shipmentId,
  documentType,
  title,
  description,
  required = false,
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingDocument, setExistingDocument] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch existing document if available
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data, error } = await (supabase.from('shipping_documents' as any)
          .select("*")
          .eq("shipment_id", shipmentId)
          .eq("document_type", documentType)
          .single());
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error("Error fetching document:", error);
          return;
        }
        
        if (data) {
          setExistingDocument(data);
        }
      } catch (error) {
        console.error("Error in fetching document:", error);
      }
    };
    
    fetchDocument();
  }, [shipmentId, documentType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // 1. Upload file to storage
      const fileName = `${shipmentId}/${documentType}_${Date.now()}_${file.name}`;
      const { error: uploadError, data: fileData } = await supabase.storage
        .from("shipping-documents")
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Create or update document record
      const documentData = {
        shipment_id: shipmentId,
        document_type: documentType,
        file_path: fileName,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        status: "uploaded",
      };
      
      const { error: dbError } = existingDocument 
        ? await (supabase.from('shipping_documents' as any)
            .update({
              file_path: fileName,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              status: "uploaded",
              updated_at: new Date().toISOString()
            })
            .eq("id", existingDocument.id))
        : await (supabase.from('shipping_documents' as any)
            .insert(documentData));
      
      if (dbError) throw dbError;
      
      // Refresh document data
      const { data: newDoc } = await (supabase.from('shipping_documents' as any)
        .select("*")
        .eq("shipment_id", shipmentId)
        .eq("document_type", documentType)
        .single());
      
      setExistingDocument(newDoc);
      setFile(null);
      
      toast({
        title: "Upload Successful",
        description: `${title} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!existingDocument?.file_path) return;
    
    try {
      const { data, error } = await supabase.storage
        .from("shipping-documents")
        .download(existingDocument.file_path);
        
      if (error) throw error;
      
      // Create URL for the downloaded file
      const url = URL.createObjectURL(data);
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = existingDocument.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!existingDocument) return;
    
    try {
      // 1. Delete file from storage
      if (existingDocument.file_path) {
        const { error: storageError } = await supabase.storage
          .from("shipping-documents")
          .remove([existingDocument.file_path]);
          
        if (storageError) {
          console.error("Error deleting from storage:", storageError);
          // Continue anyway to clean up the database record
        }
      }
      
      // 2. Delete record from database
      const { error: dbError } = await (supabase.from('shipping_documents' as any)
        .delete()
        .eq("id", existingDocument.id));
        
      if (dbError) throw dbError;
      
      setExistingDocument(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Document Deleted",
        description: `${title} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the document.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">
            {title} {required && <span className="text-red-500">*</span>}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {existingDocument ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                  <FileText className="text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">{existingDocument.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(existingDocument.file_size / 1024).toFixed(2)} KB • Uploaded on {
                        new Date(existingDocument.created_at).toLocaleDateString()
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleDownload}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Document uploaded successfully</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={`${documentType}-upload`}>Select File</Label>
                  <Input
                    id={`${documentType}-upload`}
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                
                {file && (
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                    <FileText className="text-blue-500" />
                    <div className="flex-grow">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> Upload Document
                    </>
                  )}
                </Button>
                
                {required && (
                  <p className="text-sm text-red-500">
                    This document is required based on the shipment terms.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this {title}? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

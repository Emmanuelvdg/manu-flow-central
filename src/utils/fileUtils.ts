
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse a CSV file to JSON using PapaParse
 */
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data as any[]);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parse an Excel file to JSON using SheetJS
 */
export const parseExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        resolve(jsonData as any[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

/**
 * Parse a file based on its extension
 */
export const parseFile = async (file: File): Promise<any[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    throw new Error('File has no extension');
  }
  
  if (extension === 'csv') {
    return parseCSV(file);
  } else if (['xlsx', 'xls'].includes(extension)) {
    return parseExcel(file);
  } else {
    throw new Error(`Unsupported file extension: ${extension}`);
  }
};

/**
 * Generate a CSV template for materials
 */
export const generateMaterialsTemplate = (): string => {
  const headers = ['name', 'category', 'unit', 'vendor', 'quantity', 'costPerUnit'];
  const csvContent = [headers.join(',')].join('\n');
  return csvContent;
};

/**
 * Download content as a file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

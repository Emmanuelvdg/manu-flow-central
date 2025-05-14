
# Bulk Upload Implementation Documentation

## Conversation Summary and Development Steps

This document summarizes the conversation and the steps taken to implement bulk upload functionality for Resources and BOM, along with the changes made to the codebase.

### Initial Planning

We started by discussing a design approach for bulk upload functionality with the following requirements:

1. **Materials Section**
   - Add a bulk upload button next to "New Material" in the MaterialsHeader
   - Create a modal dialog for file upload (CSV/Excel)
   - Implement data validation and preview
   - Process uploads in batch to improve performance

2. **Recipe/BOM Section**
   - Add a bulk material import button in the RecipeMaterialsSection
   - Support mapping imported materials to existing ones
   - Allow adding multiple materials to a recipe at once

### Implementation Details

#### 1. Created BulkUploadDialog Component

We implemented a reusable `BulkUploadDialog` component with the following features:
- File upload for CSV and Excel formats
- Template download functionality
- Preview of the first 5 rows of data
- Progress indicator with status updates
- Validation of required fields
- Error handling and reporting

File: `src/components/resources/BulkUploadDialog.tsx`

#### 2. Updated MaterialsHeader Component

We modified the `MaterialsHeader` component to:
- Add a "Bulk Upload" button next to the existing "New Material" button
- Toggle the BulkUploadDialog when clicked
- Pass existingMaterials for validation
- Handle the upload complete callback

File: `src/components/resources/MaterialsHeader.tsx`

#### 3. Enhanced MaterialsSection Component

We updated the `MaterialsSection` to:
- Implement the `handleBulkUpload` function for processing uploaded materials
- Add database operations to save materials in batch
- Handle validation and deduplication of materials
- Create material batches for materials with stock quantity
- Use proper database column naming (snake_case) for Supabase operations
- Update the UI after bulk upload is complete

File: `src/components/resources/MaterialsSection.tsx`

#### 4. Added Recipe Materials Bulk Upload

We enhanced the `RecipeMaterialsSection` to:
- Add a "Bulk Import" button next to "Add Material"
- Toggle the BulkUploadDialog with templateType="recipe-materials"
- Process uploaded materials and add them to the recipe
- Handle the upload complete callback

File: `src/components/recipe/RecipeMaterialsSection.tsx`

#### 5. Created File Utility Functions

We added utility functions for file processing:
- CSV parsing with PapaParse
- Excel parsing with SheetJS
- Template generation
- File download functionality

File: `src/utils/fileUtils.ts`

#### 6. Fixed TypeScript Errors

We encountered and fixed several TypeScript errors:
- Corrected camelCase/snake_case mismatches between TypeScript interfaces and Supabase
- Updated the database insertion to use correct column names
- Removed the `Partial<MaterialBatch>` typing for better type safety
- Ensured proper type conversions for numeric values

### Technical Details

#### Data Flow

1. User clicks "Bulk Upload" or "Bulk Import" button
2. BulkUploadDialog opens and user selects a file
3. File is parsed client-side using fileUtils.ts
4. Data is validated and a preview is shown
5. User confirms the upload
6. Data is processed in batches and sent to Supabase
7. UI is updated with new data
8. Success/failure message is displayed

#### Database Operations

For Materials:
- Check if material with name already exists
- Update existing or insert new material
- Create a batch if stock quantity is provided

For Recipe Materials:
- Add materials to the recipe with specified quantities
- Use temporary IDs for new materials

#### Libraries Used

- PapaParse for CSV parsing
- SheetJS (xlsx) for Excel parsing
- React components from shadcn/ui for UI elements
- React Query for data fetching and state management

### Next Steps and Potential Improvements

1. **Refactoring Large Components**
   - Both `MaterialsSection.tsx` and `BulkUploadDialog.tsx` are getting large and could benefit from further refactoring

2. **Data Validation Enhancements**
   - Add more robust validation for special cases
   - Improve error reporting for specific fields

3. **Performance Optimization**
   - Implement true batch processing for large uploads
   - Add pagination or virtualization for large data sets

4. **UX Improvements**
   - Add column mapping for flexible CSV formats
   - Improve template downloads with example data

### Dependencies

Make sure the following dependencies are installed:
- papaparse (for CSV parsing)
- xlsx (for Excel parsing)

### How to Use the Bulk Upload Feature

#### For Materials:
1. Go to the Resources page and select the Materials tab
2. Click the "Bulk Upload" button next to "New Material"
3. Download the template if needed
4. Select a CSV or Excel file with material data
5. Review the preview and click "Import"

#### For Recipe Materials:
1. Open a recipe or create a new one
2. In the Materials section, click "Bulk Import"
3. Select a CSV or Excel file with material data
4. Review the preview and click "Import"

#### CSV/Excel Format for Materials:
- name (required): string
- category: string
- unit (required): string
- vendor: string
- quantity: number (for stock)
- costPerUnit: number

#### CSV/Excel Format for Recipe Materials:
- name (required): string
- quantity (required): number
- unit (required): string

### Code Refactoring Recommendations

Consider refactoring the following components that are growing too large:
- `src/components/resources/BulkUploadDialog.tsx` (255 lines)
- `src/components/resources/MaterialsSection.tsx` (284 lines)

These could be broken down into smaller, more focused components for better maintainability.

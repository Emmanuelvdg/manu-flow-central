import { supabase } from './client';

export async function ensureStorageBucket(bucketName: string) {
  try {
    // Check if bucket exists by attempting to list objects from it
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (error) {
      // If we get a specific error about the bucket not existing
      if (error.message?.includes('The resource was not found') || 
          error.message?.includes('bucket_not_found')) {
        console.error(`Bucket ${bucketName} does not exist or is not accessible`);
        return false;
      }
      
      // If we get a permissions error (likely RLS related)
      if (error.message?.includes('row-level security') || error.status === 400) {
        console.error(`Permission denied accessing bucket ${bucketName}. RLS policy may be restricting access.`);
        return false;
      }
      
      // Other errors
      console.error('Error checking bucket:', error);
      return false;
    }
    
    // If we can successfully list objects, the bucket exists and we have access
    console.log(`Bucket ${bucketName} exists and is accessible`);
    return true;
  } catch (error) {
    console.error('Error in ensureStorageBucket:', error);
    return false;
  }
}

export async function uploadToStorage(bucketName: string, filePath: string, file: File) {
  try {
    // First ensure the bucket is accessible
    const bucketAccessible = await ensureStorageBucket(bucketName);
    
    if (!bucketAccessible) {
      throw new Error(`Storage bucket ${bucketName} is not accessible. Please check Supabase configuration.`);
    }
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error(`Error uploading to ${bucketName}:`, uploadError);
      throw new Error(uploadError.message || `Failed to upload to ${bucketName}`);
    }
    
    if (!uploadData) {
      throw new Error('No upload data returned');
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    if (!data || !data.publicUrl) {
      throw new Error(`Failed to get public URL for uploaded file in ${bucketName}`);
    }
    
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error in uploadToStorage:', error);
    throw error;
  }
}

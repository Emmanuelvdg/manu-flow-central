
import { supabase } from './client';

export async function ensureStorageBucket(bucketName: string) {
  try {
    // Check if bucket exists
    const { data: buckets, error: checkError } = await supabase.storage.listBuckets();
    
    if (checkError) {
      console.error('Error checking buckets:', checkError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureStorageBucket:', error);
    return false;
  }
}

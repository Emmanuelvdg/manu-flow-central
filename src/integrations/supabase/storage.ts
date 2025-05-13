
import { supabase } from './client';

export async function ensureStorageBucket(bucketName: string) {
  try {
    // Check if bucket exists
    const { data: buckets, error: checkError } = await supabase.storage.listBuckets();
    
    if (checkError) {
      console.error('Error checking buckets:', checkError);
      return false;
    }
    
    // Check if buckets is null or undefined
    if (!buckets) {
      console.error('No buckets data returned');
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.error(`Bucket ${bucketName} does not exist, attempting to create it`);
      
      // Try to create the bucket if it doesn't exist
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880 // 5MB limit
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
      return true;
    }
    
    console.log(`Bucket ${bucketName} exists and is ready to use`);
    return true;
  } catch (error) {
    console.error('Error in ensureStorageBucket:', error);
    return false;
  }
}

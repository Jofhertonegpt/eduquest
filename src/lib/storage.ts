import { supabase } from "./supabase";

export const initializeStorageBucket = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'social-media');
    
    if (!bucketExists) {
      console.log('Creating new storage bucket...');
      const { error: createError } = await supabase.storage.createBucket('social-media', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'video/mp4',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
    }

    // Create user's upload directory
    const userUploadPath = `${user.id}/uploads`;
    const { error: uploadError } = await supabase.storage
      .from('social-media')
      .upload(`${userUploadPath}/.keep`, new Blob([''], { type: 'text/plain' }), {
        upsert: true
      });

    if (uploadError && uploadError.message !== 'The resource already exists') {
      console.error('Error creating user directory:', uploadError);
      throw uploadError;
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/uploads/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('social-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // Simulate progress since onUploadProgress is no longer available
  if (onProgress) {
    onProgress(100);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('social-media')
    .getPublicUrl(filePath);

  return { 
    publicUrl, 
    isMedia: file.type.startsWith('image/') || file.type.startsWith('video/') 
  };
};
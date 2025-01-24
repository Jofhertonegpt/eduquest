import { supabase } from "./supabase";

export const initializeStorageBucket = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // First check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'social-media');
    
    if (!bucketExists) {
      console.log('Creating new storage bucket...');
      const { data, error: createError } = await supabase.storage.createBucket('social-media', {
        public: false,
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'video/mp4',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
      console.log('Storage bucket created successfully:', data);
    }

    // Update bucket public access
    const { error: updateError } = await supabase.storage.updateBucket('social-media', {
      public: true
    });

    if (updateError) {
      console.error('Error updating bucket:', updateError);
      throw updateError;
    }

    // Ensure the user's upload directory exists
    const userUploadPath = `${user.id}/uploads`;
    await supabase.storage.from('social-media').list(userUploadPath);
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // Ensure bucket exists before upload
  await initializeStorageBucket();

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
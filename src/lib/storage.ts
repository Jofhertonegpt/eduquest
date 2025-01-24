import { supabase } from "./supabase";

interface UploadResult {
  text?: string;
  publicUrl?: string;
  isMedia?: boolean;
}

export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<UploadResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // For curriculum imports, read as text
    if (file.type === 'application/json') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            if (onProgress) {
              onProgress(100);
            }
            resolve({ text: e.target.result as string });
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    }

    // For social media posts, handle as regular file upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    if (onProgress) {
      onProgress(100);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return { 
      publicUrl, 
      isMedia: file.type.startsWith('image/') || file.type.startsWith('video/') 
    };
  } catch (error) {
    console.error('Error handling file:', error);
    throw error;
  }
};
import { supabase } from "./supabase";

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Read the file as text instead of trying to upload to storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Simulate progress
          if (onProgress) {
            onProgress(100);
          }
          resolve({ 
            text: e.target.result,
            isMedia: file.type.startsWith('image/') || file.type.startsWith('video/') 
          });
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Error handling file:', error);
    throw error;
  }
};
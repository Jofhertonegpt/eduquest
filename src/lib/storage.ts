import { supabase } from "./supabase";

export interface UploadResult {
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
            if (onProgress) onProgress(100);
            resolve({ text: e.target.result as string });
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    }

    // For other files, return empty object as we're focusing on curriculum imports
    if (onProgress) onProgress(100);
    return {};
  } catch (error) {
    console.error('Error handling file:', error);
    throw error;
  }
};
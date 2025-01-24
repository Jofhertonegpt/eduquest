import { createClient } from '@supabase/supabase-js';
import DOMPurify from 'dompurify';

const supabaseUrl = 'https://jemwazskuncpsnpqxsso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbXdhenNrdW5jcHNucHF4c3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjAwNjEsImV4cCI6MjA1MzIzNjA2MX0.G0hMc-f5X3MAIVoAn2CiRSvmOrlMAVaHBxcZdCiQPwU';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize storage bucket
export const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'social-media');
    
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket('social-media', {
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
      }, {
        public: true // This is the third required argument
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
      
      console.log('Storage bucket created successfully:', data);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

// Utility function to sanitize user input
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
};

// Rate limiting utility
const rateLimiter = new Map<string, number>();

export const checkRateLimit = (userId: string, limit: number = 10): boolean => {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || 0;
  
  if (userRequests >= limit) {
    return false;
  }
  
  rateLimiter.set(userId, userRequests + 1);
  setTimeout(() => rateLimiter.delete(userId), 60000); // Reset after 1 minute
  
  return true;
};

// Initialize storage when the app starts
initializeStorage().catch(console.error);
import CryptoJS from 'crypto-js';
import { z } from 'zod';

const ENCRYPTION_KEY = 'your-secret-key'; // Replace with environment variable

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Define a more flexible schema that accepts both string IDs and full course objects
export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string(),
    requiredCredits: z.number(),
    courses: z.array(
      z.union([
        z.string(),
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          credits: z.number(),
          level: z.enum(['introductory', 'intermediate', 'advanced']),
          modules: z.array(z.any()).optional()
        })
      ])
    )
  }))
});
import { z } from "zod";
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-secret-key'; // In production, this should be an environment variable

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Define a more flexible schema that accepts both string IDs and full course objects
export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(), // Accept any string for degree type
    description: z.string(),
    requiredCredits: z.number(),
    courses: z.array(
      z.union([
        z.string(), // Allow string course IDs
        z.object({ // Allow full course objects
          id: z.string(),
          title: z.string(),
          description: z.string(),
          credits: z.number(),
          level: z.string(),
          modules: z.array(z.any()).optional()
        })
      ])
    )
  }))
});
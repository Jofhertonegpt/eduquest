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

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  programOutcomes: z.array(z.string()),
  institution: z.string(),
  complianceStandards: z.array(z.string()),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(), // Changed from enum to string to allow "undergraduate"
    description: z.string(),
    requiredCredits: z.number(),
    metadata: z.object({
      academicYear: z.string(),
      deliveryFormat: z.string(),
      department: z.string()
    }),
    courses: z.array(z.union([
      z.string(),
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        credits: z.number(),
        level: z.string(),
        modules: z.array(z.any()).optional()
      })
    ]))
  }))
});
import CryptoJS from 'crypto-js';
import { z } from 'zod';

// Encryption key should be stored in environment variables in production
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-32chars-minimum!!!';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Data validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(2).max(100),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const moduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string(),
  credits: z.number(),
  metadata: z.object({
    estimatedTime: z.number(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    prerequisites: z.array(z.string()),
    tags: z.array(z.string()),
    skills: z.array(z.string())
  }),
  learningObjectives: z.array(z.any()),
  resources: z.array(z.any()),
  assignments: z.array(z.any()),
  quizzes: z.array(z.any())
});

export const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string(),
  credits: z.number(),
  level: z.enum(['introductory', 'intermediate', 'advanced']),
  modules: z.array(moduleSchema)
});

export const curriculumSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(200),
  description: z.string(),
  degrees: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(3),
    type: z.enum(['associates', 'bachelors', 'masters', 'doctorate', 'certificate']),
    description: z.string(),
    requiredCredits: z.number(),
    courses: z.array(courseSchema)
  }))
});
import CryptoJS from 'crypto-js';
import { z } from 'zod';

// Encryption key should be stored in environment variables in production
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key-32chars-minimum!!!';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Data validation schemas
const questionBaseSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  type: z.enum(['multiple-choice', 'essay', 'coding', 'true-false', 'short-answer', 'matching']),
  points: z.number(),
  explanation: z.string().optional(),
});

const multipleChoiceQuestionSchema = questionBaseSchema.extend({
  type: z.literal('multiple-choice'),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  allowMultiple: z.boolean().optional(),
});

const essayQuestionSchema = questionBaseSchema.extend({
  type: z.literal('essay'),
  minWords: z.number().optional(),
  maxWords: z.number().optional(),
  rubric: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      points: z.number(),
      description: z.string(),
    })),
  }).optional(),
});

const codingQuestionSchema = questionBaseSchema.extend({
  type: z.literal('coding'),
  initialCode: z.string().optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
  })),
});

const trueFalseQuestionSchema = questionBaseSchema.extend({
  type: z.literal('true-false'),
  correctAnswer: z.boolean(),
});

const shortAnswerQuestionSchema = questionBaseSchema.extend({
  type: z.literal('short-answer'),
  sampleAnswer: z.string(),
  keywords: z.array(z.string()).optional(),
});

const matchingQuestionSchema = questionBaseSchema.extend({
  type: z.literal('matching'),
  pairs: z.array(z.object({
    left: z.string(),
    right: z.string(),
  })),
});

const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  essayQuestionSchema,
  codingQuestionSchema,
  trueFalseQuestionSchema,
  shortAnswerQuestionSchema,
  matchingQuestionSchema,
]);

export const quizSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  timeLimit: z.number().optional(),
  passingScore: z.number().optional(),
  questions: z.array(questionSchema),
  instructions: z.string().optional(),
  attempts: z.number().optional(),
  randomizeQuestions: z.boolean().optional(),
});

export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  points: z.number(),
  status: z.enum(['pending', 'submitted', 'graded']).optional(),
  questions: z.array(questionSchema).optional(),
  timeLimit: z.number().optional(),
  instructions: z.string().optional(),
  rubric: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      description: z.string(),
      points: z.number(),
    })),
  }).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(['document', 'video', 'link']),
  })).optional(),
});

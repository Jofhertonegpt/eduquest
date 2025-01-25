import CryptoJS from 'crypto-js';
import { z } from 'zod';
import type { Question, Quiz, Assignment } from '@/types/curriculum';

// Encryption key should be stored in environment variables in production
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key-32chars-minimum!!!';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Question type schemas
const baseQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  type: z.enum(['multiple-choice', 'essay', 'coding', 'true-false', 'short-answer', 'matching']),
  points: z.number(),
  explanation: z.string().optional(),
});

const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('multiple-choice'),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  allowMultiple: z.boolean().optional(),
});

const essayQuestionSchema = baseQuestionSchema.extend({
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

const codingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('coding'),
  initialCode: z.string().optional(),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
  })),
});

const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('true-false'),
  correctAnswer: z.boolean(),
});

const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('short-answer'),
  sampleAnswer: z.string(),
  keywords: z.array(z.string()).optional(),
});

const matchingQuestionSchema = baseQuestionSchema.extend({
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
});

export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  points: z.number(),
  questions: z.array(questionSchema).optional(),
  rubric: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      description: z.string(),
      points: z.number(),
    })),
  }).optional(),
});

export const curriculumSchema = z.object({
  name: z.string(),
  description: z.string(),
  degrees: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['associates', 'bachelors', 'masters', 'doctorate', 'certificate']),
    description: z.string(),
    requiredCredits: z.number(),
    courses: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      credits: z.number(),
      level: z.enum(['introductory', 'intermediate', 'advanced']),
      modules: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        credits: z.number(),
        metadata: z.object({
          estimatedTime: z.number(),
          difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
          prerequisites: z.array(z.string()),
          tags: z.array(z.string()),
          skills: z.array(z.string())
        }),
        learningObjectives: z.array(z.object({
          id: z.string(),
          description: z.string(),
          assessmentCriteria: z.array(z.string())
        })),
        resources: z.array(z.object({
          id: z.string(),
          title: z.string(),
          type: z.enum(['video', 'pdf', 'epub', 'article', 'document', 'code']),
          content: z.string(),
          duration: z.string().optional(),
          url: z.string().optional(),
          embedType: z.enum(['youtube']).optional(),
          code: z.object({
            initialCode: z.string(),
            solution: z.string(),
            testCases: z.array(z.object({
              input: z.string(),
              expectedOutput: z.string()
            }))
          }).optional()
        })),
        assignments: z.array(assignmentSchema),
        quizzes: z.array(quizSchema)
      }))
    }))
  }))
});

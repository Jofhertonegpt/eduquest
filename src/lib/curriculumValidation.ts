import { z } from "zod";
import type { Question, Quiz, Assignment, Resource, Module, Course, Curriculum } from "@/types/curriculum";
import { curriculumSchema } from "@/lib/encryption";

export const validateAndTransformQuestion = (q: any): Question => {
  const baseQuestion = {
    id: q.id || crypto.randomUUID(),
    title: q.question || '',
    description: q.explanation || '',
    points: q.points || 0,
    type: q.type,
  };

  switch (q.type) {
    case 'multiple-choice':
      return {
        ...baseQuestion,
        type: 'multiple-choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer || 0,
        allowMultiple: q.allowMultiple || false,
      };
    case 'essay':
      return {
        ...baseQuestion,
        type: 'essay',
        minWords: q.minWords || 0,
        maxWords: q.maxWords || 1000,
        rubric: q.rubric ? {
          criteria: (q.rubric.criteria || []).map(c => ({
            name: c.name || 'Unnamed Criterion',
            description: c.description || 'No description provided',
            points: c.points || 0
          }))
        } : { criteria: [] }
      };
    case 'coding':
      return {
        ...baseQuestion,
        type: 'coding',
        initialCode: q.initialCode || '',
        testCases: (q.testCases || []).map(tc => ({
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || ''
        }))
      };
    case 'true-false':
      return {
        ...baseQuestion,
        type: 'true-false',
        correctAnswer: q.correctAnswer || false,
      };
    case 'short-answer':
      return {
        ...baseQuestion,
        type: 'short-answer',
        sampleAnswer: q.sampleAnswer || '',
        keywords: q.keywords || [],
      };
    case 'matching':
      return {
        ...baseQuestion,
        type: 'matching',
        pairs: (q.pairs || []).map(p => ({
          left: p.left || '',
          right: p.right || ''
        }))
      };
    default:
      throw new Error(`Unsupported question type: ${q.type}`);
  }
};

export const validateAndTransformResource = (resource: any): Resource => ({
  id: resource.id || crypto.randomUUID(),
  title: resource.title || '',
  type: resource.type || 'document',
  content: resource.content || '',
  duration: resource.duration,
  url: resource.url,
  embedType: resource.embedType,
  code: resource.code ? {
    initialCode: resource.code.initialCode || '',
    solution: resource.code.solution || '',
    testCases: (resource.code.testCases || []).map(tc => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || ''
    }))
  } : undefined
});

export const validateAndTransformModule = (module: any): Module => ({
  id: module.id || crypto.randomUUID(),
  title: module.title,
  description: module.description,
  credits: module.credits,
  metadata: {
    estimatedTime: module.metadata.estimatedTime,
    difficulty: module.metadata.difficulty,
    prerequisites: module.metadata.prerequisites,
    tags: module.metadata.tags,
    skills: module.metadata.skills
  },
  learningObjectives: module.learningObjectives.map(obj => ({
    id: obj.id || crypto.randomUUID(),
    description: obj.description || '',
    assessmentCriteria: obj.assessmentCriteria || []
  })),
  resources: module.resources.map(validateAndTransformResource),
  assignments: module.assignments.map(assignment => ({
    id: assignment.id || crypto.randomUUID(),
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate,
    points: assignment.points,
    questions: (assignment.questions || []).map(validateAndTransformQuestion),
    rubric: assignment.rubric ? {
      criteria: (assignment.rubric.criteria || []).map(c => ({
        name: c.name || 'Unnamed Criterion',
        description: c.description || 'No description provided',
        points: c.points || 0
      }))
    } : { criteria: [] }
  })),
  quizzes: module.quizzes.map(quiz => ({
    id: quiz.id || crypto.randomUUID(),
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map(validateAndTransformQuestion),
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    instructions: quiz.instructions
  }))
});

export const validateAndTransformCurriculum = (rawData: any): Curriculum => {
  const validationResult = curriculumSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    throw new Error("Invalid curriculum format: " + validationResult.error.message);
  }

  const { data } = validationResult;

  return {
    name: data.name,
    description: data.description,
    degrees: data.degrees.map(degree => ({
      id: degree.id || crypto.randomUUID(),
      title: degree.title,
      type: degree.type,
      description: degree.description,
      requiredCredits: degree.requiredCredits,
      courses: degree.courses.map(course => ({
        id: course.id || crypto.randomUUID(),
        title: course.title,
        description: course.description,
        credits: course.credits,
        level: course.level,
        modules: course.modules.map(validateAndTransformModule)
      }))
    }))
  };
};
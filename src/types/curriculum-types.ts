export interface ProgramInfo {
  id: string;
  name: string;
  description: string;
  programOutcomes: string[];
  institution: string;
  complianceStandards: string[];
}

export interface Degree {
  id: string;
  programId: string;
  title: string;
  type: 'undergraduate' | 'graduate' | 'certificate';
  description: string;
  requiredCredits: number;
  metadata: {
    academicYear: string;
    deliveryFormat: string;
    department: string;
  };
}

export interface Course {
  id: string;
  degreeId: string;
  title: string;
  description: string;
  credits: number;
  level: string;
  metadata: {
    instructor: string;
    meetingTimes: string;
    tags: string[];
    skills: string[];
  };
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  credits: number;
  metadata: {
    estimatedTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
  };
  learningObjectives: {
    id: string;
    description: string;
    assessmentCriteria: string[];
  }[];
}

export interface Resource {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'article' | 'code';
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
}

export interface Assignment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  questions: Question[];
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  questions: Question[];
}

export type Question = {
  id: string;
  type: 'multiple-choice' | 'essay' | 'coding' | 'true-false' | 'short-answer';
  title: string;
  description: string;
  points: number;
} & (
  | {
      type: 'multiple-choice';
      options: string[];
      correctAnswer: number;
    }
  | {
      type: 'essay';
      minWords?: number;
      maxWords?: number;
      rubric?: {
        criteria: {
          name: string;
          points: number;
          description: string;
        }[];
      };
    }
  | {
      type: 'coding';
      initialCode?: string;
      testCases: {
        input: string;
        expectedOutput: string;
      }[];
    }
  | {
      type: 'true-false';
      correctAnswer: boolean;
    }
  | {
      type: 'short-answer';
      sampleAnswer: string;
      keywords?: string[];
    }
);
export type JsonInputs = {
  curriculum: string;
  courses: string;
  modules: string;
};

export type DegreeType = 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'certificate' | 'undergraduate' | string;
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ResourceType = 'video' | 'pdf' | 'epub' | 'article' | 'document' | 'code';
export type CourseLevel = 'introductory' | 'intermediate' | 'advanced';

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites?: string[];
  tags?: string[];
  skills?: string[];
}

export interface CourseMetadata {
  instructor: string;
  meetingTimes: string;
  tags: string[];
  skills: string[];
}

export interface DegreeMetadata {
  academicYear: string;
  deliveryFormat: string;
  department: string;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  type?: 'resource' | 'assignment' | 'quiz';
  courseId?: string;
  metadata?: ModuleMetadata;
  learningObjectives?: {
    id: string;
    description: string;
    assessmentCriteria: string[];
  }[];
}

export interface CourseModule extends ModuleData {
  courseId: string;
  credits: number;
  metadata: ModuleMetadata;
  learningObjectives: {
    id: string;
    description: string;
    assessmentCriteria: string[];
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: CourseLevel;
  metadata: CourseMetadata;
  modules: string[] | Module[];
}

export interface Degree {
  id: string;
  title: string;
  type: DegreeType;
  description: string;
  requiredCredits: number;
  metadata: DegreeMetadata;
  courses: string[] | Course[];
}

export interface Module extends ModuleData {
  credits: number;
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
  module_status?: string;
  module_type?: string;
  content?: any;
  curriculum_id?: string;
  display_order?: number;
  version?: number;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
  code?: {
    initialCode: string;
    solution: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  };
}

export interface Question {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'multiple-choice' | 'essay' | 'coding' | 'true-false' | 'short-answer' | 'matching';
  options?: string[];
  correctAnswer?: number | boolean;
  allowMultiple?: boolean;
  minWords?: number;
  maxWords?: number;
  initialCode?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
  sampleAnswer?: string;
  keywords?: string[];
  pairs?: {
    left: string;
    right: string;
  }[];
  rubric?: {
    criteria: {
      name: string;
      description: string;
      points: number;
    }[];
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  passingScore?: number;
  questions: Question[];
  instructions?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  questions?: Question[];
  rubric?: {
    criteria: {
      name: string;
      description: string;
      points: number;
    }[];
  };
}

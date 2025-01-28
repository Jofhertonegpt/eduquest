// Base types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseLevel = 'undergraduate' | 'graduate' | 'certificate';
export type ResourceType = 'video' | 'document' | 'article' | 'code';

// Metadata types
export interface CourseMetadata {
  instructor: string;
  meetingTimes: string;
  tags: string[];
  skills: string[];
  duration?: string;
  category?: string;
}

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
}

// Core curriculum types
export interface Program {
  name: string;
  description: string;
  programOutcomes: string[];
  institution: string;
  complianceStandards: string[];
  degrees: Degree[];
}

export interface Degree {
  id: string;
  title: string;
  type: CourseLevel;
  description: string;
  requiredCredits: number;
  metadata: {
    academicYear: string;
    deliveryFormat: string;
    department: string;
  };
  courses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: CourseLevel;
  metadata: CourseMetadata;
  modules: Module[];
  category: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  credits: number;
  metadata: ModuleMetadata;
  learningObjectives: LearningObjective[];
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
}

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
  code?: CodeContent;
}

export interface CodeContent {
  initialCode: string;
  solution: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  questions: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isCompleted?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  points: number;
}

export type QuestionType = 'multiple-choice' | 'essay' | 'coding' | 'true-false' | 'short-answer';

// Component Props types
export interface CourseCardProps {
  course: Course;
  modules: Module[];
  index: number;
}

export interface QuizPlayerProps {
  quiz: Quiz;
  isCompleted: boolean;
  onComplete: (score: number) => void;
}

export interface ResourceViewerProps {
  resource: Resource;
  isCompleted: boolean;
  onComplete: (resourceId: string) => void;
}
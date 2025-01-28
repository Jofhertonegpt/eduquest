<<<<<<< HEAD
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
=======
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
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
<<<<<<< HEAD
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

=======
  type: string;
  description: string;
  requiredCredits: number;
  metadata: DegreeMetadata;
  courses: string[];
}

export interface DegreeMetadata {
  academicYear: string;
  deliveryFormat: string;
  department: string;
}

>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
<<<<<<< HEAD
  level: CourseLevel;
  metadata: CourseMetadata;
  modules: Module[];
  category: string;
  duration: string;
=======
  level: string;
  metadata: CourseMetadata;
  modules: string[];
}

export interface CourseMetadata {
  instructor: string;
  meetingTimes: string;
  tags: string[];
  skills: string[];
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
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

<<<<<<< HEAD
=======
export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  tags: string[];
  skills: string[];
}

>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Resource {
  id: string;
  title: string;
<<<<<<< HEAD
  type: ResourceType;
=======
  type: 'video' | 'document' | 'article' | 'code';
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
<<<<<<< HEAD
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
=======
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
<<<<<<< HEAD
  questions: Question[];
=======
  questions?: Question[];
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
<<<<<<< HEAD
  isCompleted?: boolean;
=======
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
}

export interface Question {
  id: string;
<<<<<<< HEAD
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
=======
  type: 'multiple-choice' | 'essay' | 'coding';
  title: string;
  description: string;
  points: number;
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
}
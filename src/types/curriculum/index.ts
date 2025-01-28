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

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: string;
  metadata: CourseMetadata;
  modules: string[];
}

export interface CourseMetadata {
  instructor: string;
  meetingTimes: string;
  tags: string[];
  skills: string[];
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

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  tags: string[];
  skills: string[];
}

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'article' | 'code';
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  questions?: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'essay' | 'coding';
  title: string;
  description: string;
  points: number;
}
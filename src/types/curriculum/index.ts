export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

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

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
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
  type: 'video' | 'document' | 'article' | 'code';
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube';
}

export type QuestionType = 
  | 'multiple-choice'
  | 'essay'
  | 'coding'
  | 'true-false'
  | 'short-answer'
  | 'presentation'
  | 'diagram';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface EssayQuestion extends BaseQuestion {
  type: 'essay';
}

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
}

export interface PresentationQuestion extends BaseQuestion {
  type: 'presentation';
}

export interface DiagramQuestion extends BaseQuestion {
  type: 'diagram';
}

export type Question =
  | MultipleChoiceQuestion
  | EssayQuestion
  | CodingQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | PresentationQuestion
  | DiagramQuestion;

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
}
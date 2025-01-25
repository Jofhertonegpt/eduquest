export type DegreeType = 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'certificate';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ResourceType = 'video' | 'pdf' | 'epub' | 'article' | 'document' | 'code';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status?: 'pending' | 'submitted' | 'graded';
  questions?: Question[];
  timeLimit?: number;
  instructions?: string;
  rubric?: {
    criteria: {
      name: string;
      description: string;
      points: number;
    }[];
  };
  resources?: {
    title: string;
    url: string;
    type: 'document' | 'video' | 'link';
  }[];
}

export type QuestionType = 'multiple-choice' | 'essay' | 'coding' | 'true-false' | 'short-answer' | 'matching';

export interface BaseQuestion {
  id: string;
  question: string;
  type: QuestionType;
  points: number;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
  allowMultiple?: boolean;
}

export interface EssayQuestion extends BaseQuestion {
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

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
  initialCode?: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  sampleAnswer: string;
  keywords?: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: {
    left: string;
    right: string;
  }[];
}

export type Question = 
  | MultipleChoiceQuestion 
  | EssayQuestion 
  | CodingQuestion 
  | TrueFalseQuestion 
  | ShortAnswerQuestion 
  | MatchingQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore?: number;
  questions: Question[];
  instructions?: string;
  attempts?: number;
  randomizeQuestions?: boolean;
}

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tags: string[];
  skills: string[];
}

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  metadata: ModuleMetadata;
  learningObjectives: LearningObjective[];
  resources: LearningResource[];
  assignments: Assignment[];
  quizzes: Quiz[];
  prerequisites?: string[];
  credits: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  credits: number;
  level: 'introductory' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

export interface Degree {
  id: string;
  title: string;
  type: DegreeType;
  description: string;
  courses: Course[];
  requiredCredits: number;
  specialization?: string;
}

export interface Curriculum {
  id?: string;
  name: string;
  description: string;
  degrees: Degree[];
}

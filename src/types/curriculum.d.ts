export type DegreeType = 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'certificate' | 'undergraduate' | string;
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ResourceType = 'video' | 'pdf' | 'epub' | 'article' | 'document' | 'code';
export type CourseLevel = 'introductory' | 'intermediate' | 'advanced';
export type ModuleType = 'resource' | 'assignment' | 'quiz';

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

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  points: number;
  explanation?: string;
}

export type QuestionType = 'multiple-choice' | 'essay' | 'coding' | 'true-false' | 'short-answer' | 'matching';

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

export interface Module {
  id: string;
  title: string;
  description: string;
  credits: number;
  type?: ModuleType;
  courseId?: string;
  metadata: {
    estimatedTime: number;
    difficulty: DifficultyLevel;
    prerequisites: string[];
    tags: string[];
    skills: string[];
  };
  learningObjectives: LearningObjective[];
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: CourseLevel;
  modules: Module[];
}

export interface Degree {
  id: string;
  title: string;
  type: DegreeType;
  description: string;
  requiredCredits: number;
  courses: Course[];
}

export interface Curriculum {
  id?: string;
  name: string;
  description: string;
  degrees: Degree[];
}

export interface JsonInputs {
  curriculum: string;
  courses: string;
  modules: string;
}
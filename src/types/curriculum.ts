export type DegreeType = 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'certificate' | 'undergraduate' | string;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

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

export interface ModuleMetadata {
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
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
  questions: Array<Question>;
}

// Update Question type to be a union of all possible question types
export type Question = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | ShortAnswerQuestion 
  | EssayQuestion 
  | CodingQuestion 
  | PresentationQuestion 
  | DiagramQuestion;
export type ResourceType = 'video' | 'pdf' | 'epub' | 'article' | 'document' | 'code';
export type CourseLevel = 'introductory' | 'intermediate' | 'advanced';

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
 
  
  export interface CourseMetadata {
    instructor: string;
    meetingTimes: string;
    tags: string[];
    skills: string[];
  }
  
  export interface Program {
    name: string;
    description: string;
    programOutcomes: string[];
    institution: string;
    complianceStandards: string[];
    degrees: Degree[];
  }
  
  export interface Course {
    id: string;
    title: string;
    description: string;
    credits: number;
    level: string;
    metadata: CourseMetadata;
    modules: string[];  // Array of module IDs
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
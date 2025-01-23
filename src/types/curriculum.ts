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
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube' | 'pdf' | 'epub';
  code?: {
    initialCode: string;
    solution: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  };
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
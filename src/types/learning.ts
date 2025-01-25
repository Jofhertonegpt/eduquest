import type { DifficultyLevel } from './curriculum';

export interface LearningObjective {
  id: string;
  description: string;
  assessmentCriteria: string[];
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  requirements: {
    minimumGrade: number;
    requiredModules: string[];
    requiredAssessments: string[];
  };
  validityPeriod?: number; // in months
}

export interface ModuleMetadata {
  estimatedTime: number; // in minutes
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tags: string[];
  skills: string[];
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'coding' | 'project' | 'peer-review';
  description: string;
  difficultyLevel: DifficultyLevel;
  points: number;
  timeLimit?: number; // in minutes
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
  metadata: ModuleMetadata;
  learningObjectives: LearningObjective[];
  resources: LearningResource[];
  assessments: Assessment[];
  milestones: {
    id: string;
    title: string;
    requiredAssessments: string[];
    reward?: {
      type: 'badge' | 'certificate' | 'points';
      value: string | number;
    };
  }[];
}

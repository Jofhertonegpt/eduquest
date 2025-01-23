export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type AssessmentType = 'multiple-choice' | 'coding' | 'project' | 'essay' | 'peer-review';

export interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}

export interface Rubric {
  id: string;
  title: string;
  totalPoints: number;
  criteria: RubricCriteria[];
}

export interface CodingExercise {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  solution: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hints: string[];
}

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  description: string;
  difficultyLevel: DifficultyLevel;
  points: number;
  timeLimit?: number; // in minutes
  rubric?: Rubric;
  codingExercise?: CodingExercise;
  peerReviewRequired?: boolean;
  minimumReviewers?: number;
}
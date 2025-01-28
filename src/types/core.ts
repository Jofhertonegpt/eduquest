export interface BaseQuiz {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'coding' | 'essay';
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration: number;
    tags: string[];
  };
}

export interface BaseModule {
  id: string;
  title: string;
  description: string;
  credits: number;
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: string[];
    estimatedHours: number;
    skills: string[];
    lastUpdated: Date;
  };
  status: 'draft' | 'published' | 'archived';
}

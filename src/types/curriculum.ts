export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
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
  type: 'video' | 'article' | 'document';
  content: string;
  duration?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  resources: LearningResource[];
  assignments: Assignment[];
  quizzes: Quiz[];
}

export interface Curriculum {
  id: string;
  name: string;
  description: string;
  modules: Module[];
}
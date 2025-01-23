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
  type: 'video' | 'pdf' | 'epub' | 'article' | 'document';
  content: string;
  duration?: string;
  url?: string;
  embedType?: 'youtube' | 'pdf' | 'epub';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  resources: LearningResource[];
  assignments: Assignment[];
  quizzes: Quiz[];
  progress?: {
    completed: boolean;
    resourcesCompleted: string[];
    assignmentsSubmitted: string[];
    quizzesCompleted: string[];
  };
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  completed: boolean;
  resourcesCompleted: string[];
  assignmentsSubmitted: string[];
  quizzesCompleted: string[];
  lastAccessed: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  progress: UserProgress[];
  enrolledCourses: string[];
}

export interface Curriculum {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  enrolledUsers?: User[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
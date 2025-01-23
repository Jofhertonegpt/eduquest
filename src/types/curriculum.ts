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
  type: 'associates' | 'bachelors' | 'masters' | 'doctorate';
  description: string;
  courses: Course[];
  requiredCredits: number;
  specialization?: string;
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
  currentDegree?: Degree;
  completedDegrees?: Degree[];
}

export interface Curriculum {
  id: string;
  name: string;
  description: string;
  degrees: Degree[];
  enrolledUsers?: User[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  courseId: string;
}

export interface CourseProgress {
  id: string;
  courseId: string;
  completedModules: number; // maps to completed_modules in DB
  totalModules: number; // maps to total_modules in DB
  currentGrade: number; // maps to current_grade in DB
  rank?: number;
  totalStudents?: number; // maps to total_students in DB
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'post' | 'assignment' | 'grade' | 'announcement';
  createdAt: string;
  read: boolean;
}
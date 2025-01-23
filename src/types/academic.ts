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
  completedModules: number;
  totalModules: number;
  currentGrade: number;
  rank?: number;
  totalStudents?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'post' | 'assignment' | 'grade' | 'announcement';
  createdAt: string;
  read: boolean;
}
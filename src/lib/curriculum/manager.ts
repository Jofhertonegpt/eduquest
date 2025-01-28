import { Program, Course, Module } from '@/types/curriculum';
import { CurriculumLoader } from './loader';
import { AppError } from '@/lib/errorHandling';

export class CurriculumManager {
  private program: Program | null = null;
  private coursesMap: Map<string, Course> = new Map();
  private modulesMap: Map<string, Module> = new Map();

  async initialize(): Promise<void> {
    try {
      this.program = await CurriculumLoader.loadProgram();
      const courses = await CurriculumLoader.loadCourses();
      const modules = await CurriculumLoader.loadModules();
      
      this.coursesMap = new Map(courses.map(c => [c.id, c]));
      this.modulesMap = new Map(modules.map(m => [m.id, m]));
    } catch (error) {
      console.error('Failed to initialize curriculum manager:', error);
      throw new AppError('Failed to initialize curriculum', 'CURRICULUM_INIT_ERROR');
    }
  }

  getProgram(): Program | null {
    return this.program;
  }

  getCourse(courseId: string): Course | undefined {
    return this.coursesMap.get(courseId);
  }

  getCourseModules(courseId: string): Module[] {
    const course = this.coursesMap.get(courseId);
    if (!course) return [];
    
    return course.modules
      .map(id => this.modulesMap.get(id))
      .filter((module): module is Module => module !== undefined);
  }
}
<<<<<<< HEAD
import { CurriculumLoader } from './loader';

export class CurriculumManager {
  private program: Program;
  private coursesMap: Map<string, Course>;
  private modulesMap: Map<string, Module>;

  async initialize() {
    this.program = await CurriculumLoader.loadProgram();
    const courses = await CurriculumLoader.loadCourses();
    const modules = await CurriculumLoader.loadModules();
    
    this.coursesMap = new Map(courses.map(c => [c.id, c]));
    this.modulesMap = new Map(modules.map(m => [m.id, m]));
=======
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
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
  }

  getCourseModules(courseId: string): Module[] {
    const course = this.coursesMap.get(courseId);
<<<<<<< HEAD
    return course?.modules.map(id => this.modulesMap.get(id)) ?? [];
  }
}
=======
    if (!course) return [];
    
    return course.modules
      .map(id => this.modulesMap.get(id))
      .filter((module): module is Module => module !== undefined);
  }
}
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5

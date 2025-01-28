import { CurriculumLoader } from './loader';
import { Program, Course, Module } from '@/types/curriculum';

export class CurriculumManager {
  private program!: Program;
  private coursesMap: Map<string, Course> = new Map();
  private modulesMap: Map<string, Module> = new Map();

  async initialize() {
    this.program = await CurriculumLoader.loadProgram();
    const courses = await CurriculumLoader.loadCourses();
    const modules = await CurriculumLoader.loadModules();
    
    this.coursesMap = new Map(courses.map(c => [c.id, c]));
    this.modulesMap = new Map(modules.map(m => [m.id, m]));
  }

  getProgram(): Program {
    if (!this.program) {
      throw new Error('CurriculumManager not initialized. Call initialize() first.');
    }
    return this.program;
  }

  getCourse(courseId: string): Course | undefined {
    return this.coursesMap.get(courseId);
  }

  getCourseModules(courseId: string): Module[] {
    const course = this.coursesMap.get(courseId);
    if (!course || !course.modules) return [];
    
    return course.modules
      .map(moduleId => this.modulesMap.get(moduleId))
      .filter((module): module is Module => module !== undefined);
  }
}

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
  }

  getCourseModules(courseId: string): Module[] {
    const course = this.coursesMap.get(courseId);
    return course?.modules.map(id => this.modulesMap.get(id)) ?? [];
  }
}

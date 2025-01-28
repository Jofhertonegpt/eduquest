import { Program, Course, Module } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';

export class CurriculumLoader {
  static async loadProgram(): Promise<Program> {
    return programData as Program;
  }

  static async loadCourses(): Promise<Course[]> {
    return coursesData as Course[];
  }

  static async loadModules(): Promise<Module[]> {
    return modulesData as Module[];
  }
}

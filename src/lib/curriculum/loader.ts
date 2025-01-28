import { Program, Course, Module } from '@/types/curriculum';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { AppError } from '@/lib/errorHandling';

export class CurriculumLoader {
  static async loadProgram(): Promise<Program> {
    try {
      return programData as Program;
    } catch (error) {
      throw new AppError('Failed to load program data', 'PROGRAM_LOAD_ERROR');
    }
  }

  static async loadCourses(): Promise<Course[]> {
    try {
      return coursesData as Course[];
    } catch (error) {
      throw new AppError('Failed to load courses data', 'COURSES_LOAD_ERROR');
    }
  }

  static async loadModules(): Promise<Module[]> {
    try {
      return modulesData as Module[];
    } catch (error) {
      throw new AppError('Failed to load modules data', 'MODULES_LOAD_ERROR');
    }
  }
}
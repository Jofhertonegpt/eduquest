<<<<<<< HEAD
import { Degree } from '@/types/curriculum-types';

export const loadCurriculumData = async () => {
  try {
    // Load and validate program structure
    const program = await import('@/data/curriculum/New defaults/program.json');
    const courses = await import('@/data/curriculum/New defaults/courses.json');
    const modules = await import('@/data/curriculum/New defaults/modules.json');

    // Map relationships
    const coursesMap = new Map(courses.map(course => [course.id, course]));
    const modulesMap = new Map(modules.map(module => [module.id, module]));

    // Build curriculum tree
    return {
      program,
      courses: program.degrees[0].courses.map(courseId => ({
=======
import { AppError } from '@/lib/errorHandling';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';

export const loadCurriculumData = async () => {
  try {
    // Map relationships
    const coursesMap = new Map(coursesData.map(course => [course.id, course]));
    const modulesMap = new Map(modulesData.map(module => [module.id, module]));

    return {
      program: programData,
      courses: programData.degrees[0].courses.map(courseId => ({
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
        ...coursesMap.get(courseId),
        modules: coursesMap.get(courseId)?.modules.map(moduleId => 
          modulesMap.get(moduleId)
        )
      }))
    };
  } catch (error) {
    throw new AppError('Failed to load curriculum data', 'CURRICULUM_LOAD_ERROR');
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5

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
        ...coursesMap.get(courseId),
        modules: coursesMap.get(courseId)?.modules.map(moduleId => 
          modulesMap.get(moduleId)
        )
      }))
    };
  } catch (error) {
    throw new AppError('Failed to load curriculum data', 'CURRICULUM_LOAD_ERROR');
  }
};

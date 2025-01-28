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
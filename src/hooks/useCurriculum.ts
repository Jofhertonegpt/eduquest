import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProgramInfo, Degree, Course, CourseModule } from '@/types/curriculum-types';

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('program_info')
        .select('*');
      
      if (error) throw error;
      return data as ProgramInfo[];
    }
  });
}

export function useDegrees(programId?: string) {
  return useQuery({
    queryKey: ['degrees', programId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('degrees')
        .select('*')
        .eq('program_id', programId);
      
      if (error) throw error;
      return data as Degree[];
    },
    enabled: !!programId
  });
}

export function useCourses(degreeId?: string) {
  return useQuery({
    queryKey: ['courses', degreeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('degree_id', degreeId);
      
      if (error) throw error;
      return data as Course[];
    },
    enabled: !!degreeId
  });
}

export function useModules(courseId?: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId);
      
      if (error) throw error;
      return data as CourseModule[];
    },
    enabled: !!courseId
  });
}
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
      const query = supabase
        .from('degrees')
        .select('*');
      
      if (programId) {
        query.eq('program_id', programId);
      }
      
      const { data, error } = await query;
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
      const query = supabase
        .from('courses')
        .select('*');
      
      if (degreeId) {
        query.eq('degree_id', degreeId);
      }
      
      const { data, error } = await query;
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
      const query = supabase
        .from('course_modules')
        .select('*');
      
      if (courseId) {
        query.eq('course_id', courseId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CourseModule[];
    },
    enabled: !!courseId
  });
}
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Degree, Course, CourseModule } from '@/types/curriculum-types';

export function useDegrees(programId: string | undefined) {
  return useQuery({
    queryKey: ['degrees', programId],
    queryFn: async () => {
      if (!programId) return [];
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

export function useCourses(degreeId: string | undefined) {
  return useQuery({
    queryKey: ['courses', degreeId],
    queryFn: async () => {
      if (!degreeId) return [];
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

export function useModules(courseId: string | undefined) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from('curriculum_modules')
        .select('*')
        .eq('module_type', 'module')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match the CourseModule type
      return data.map(module => module.content) as CourseModule[];
    },
    enabled: !!courseId
  });
}
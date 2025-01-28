import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ModuleType } from '@/types/curriculum-module';

export const useCurriculumQueries = (curriculumId: string | undefined, type?: ModuleType) => {
  const { data: modules, isLoading: modulesLoading, error: modulesError } = useQuery({
    queryKey: ['curriculum-modules', curriculumId, type],
    queryFn: async () => {
      if (!curriculumId) return [];
      
      let query = supabase
        .from('curriculum_modules')
        .select('*')
        .eq('curriculum_id', curriculumId)
        .eq('module_status', 'active')
        .order('display_order', { ascending: true });

      if (type) {
        query = query.eq('module_type', type);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(module => ({
        ...module,
        content: module.module_data // Use the new module_data field
      }));
    },
    enabled: !!curriculumId
  });

  return {
    modules,
    modulesLoading,
    modulesError
  };
};
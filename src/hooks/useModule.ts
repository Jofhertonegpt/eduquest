import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BaseModule } from '@/types/core';
import { APP_CONSTANTS } from '@/constants/app';

export function useModule(moduleId: string) {
  const { data: module, ...rest } = useQuery<BaseModule>({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();
        
      if (error) throw error;
      return data;
    },
    staleTime: APP_CONSTANTS.CACHE.MODULE_TTL
  });

  const enrichedModule = useMemo(() => {
    if (!module) return null;
    return {
      ...module,
      isAdvanced: module.metadata.difficulty === 'advanced',
      totalDuration: module.metadata.estimatedHours * 60,
    };
  }, [module]);

  return { module: enrichedModule, ...rest };
}

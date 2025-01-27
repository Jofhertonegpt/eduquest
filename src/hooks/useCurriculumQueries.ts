import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Module } from "@/types/curriculum";

interface CurriculumModule {
  id: string;
  curriculum_id: string;
  content: Module;
  created_at: string;
  updated_at: string;
  module_type: string;
}

export const useCurriculumQueries = (curriculumId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError
  } = useQuery({
    queryKey: ["curriculum-modules", curriculumId],
    queryFn: async () => {
      if (!curriculumId) return null;
      
      const { data, error } = await supabase
        .from("curriculum_modules")
        .select("*")
        .eq("curriculum_id", curriculumId)
        .order("created_at");
      
      if (error) throw error;
      return data as CurriculumModule[];
    },
    enabled: !!curriculumId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2,
  });

  // Prefetch module content when hovering over module
  const prefetchModuleContent = async (moduleId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ["module-content", moduleId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("curriculum_modules")
          .select("content")
          .eq("id", moduleId)
          .maybeSingle();
        
        if (error) throw error;
        return data as { content: Module };
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    modules,
    modulesLoading,
    modulesError,
    prefetchModuleContent,
  };
};

// Separate hook for module-specific queries
export const useModuleContent = (moduleId?: string) => {
  return useQuery({
    queryKey: ["module-content", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      
      const { data, error } = await supabase
        .from("curriculum_modules")
        .select("content")
        .eq("id", moduleId)
        .maybeSingle();
      
      if (error) throw error;
      return data as { content: Module };
    },
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};
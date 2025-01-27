import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Module } from "@/types/curriculum";

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
      return data;
    },
    enabled: !!curriculumId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
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
          .single();
        
        if (error) throw error;
        return data;
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
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
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
      
      console.log("Fetching modules for curriculum:", curriculumId);
      
      const { data, error } = await supabase
        .from("curriculum_modules")
        .select("*")
        .eq("curriculum_id", curriculumId)
        .order("created_at");
      
      if (error) {
        console.error("Error fetching modules:", error);
        throw error;
      }

      console.log("Raw modules data:", data);
      return data as CurriculumModule[];
    },
    enabled: !!curriculumId,
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
    });
  };

  return {
    modules,
    modulesLoading,
    modulesError,
    prefetchModuleContent,
  };
};
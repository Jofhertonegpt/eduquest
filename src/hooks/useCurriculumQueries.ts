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
      if (!curriculumId) {
        console.log("No curriculum ID provided");
        return null;
      }
      
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

      if (!data || data.length === 0) {
        console.log("No modules found for curriculum:", curriculumId);
        // Check if the curriculum exists
        const { data: curriculum, error: currError } = await supabase
          .from("imported_curricula")
          .select("curriculum")
          .eq("id", curriculumId)
          .single();

        if (currError) {
          console.error("Error checking curriculum:", currError);
        } else if (!curriculum) {
          console.log("Curriculum not found:", curriculumId);
        } else {
          console.log("Curriculum exists but has no modules:", curriculum);
        }
      }

      console.log("Raw modules data:", data);
      // Transform the data to match our JSON structure
      return data?.map(module => ({
        ...module.content,
        id: module.id
      })) as Module[];
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
        return data?.content as Module;
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
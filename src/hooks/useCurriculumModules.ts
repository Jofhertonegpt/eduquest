import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ModuleType } from "@/types/curriculum-module";

export const useCurriculumModules = (curriculumId: string, type?: ModuleType) => {
  return useQuery({
    queryKey: ["curriculum-modules", curriculumId, type],
    queryFn: async () => {
      let query = supabase
        .from("curriculum_modules")
        .select("*")
        .eq("curriculum_id", curriculumId);

      if (type) {
        query = query.eq("module_type", type);
      }

      const { data, error } = await query.order("created_at");
      
      if (error) throw error;
      
      return data;
    },
    enabled: !!curriculumId,
  });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useProgress = (curriculumId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['curriculum-progress', curriculumId],
    queryFn: async () => {
      if (!curriculumId) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('curriculum_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('curriculum_id', curriculumId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!curriculumId,
  });

  const updateProgress = useMutation({
    mutationFn: async ({ 
      moduleId, 
      courseId 
    }: { 
      moduleId: string; 
      courseId: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !curriculumId) throw new Error('Not authenticated or no curriculum selected');

      const { data, error } = await supabase
        .from('curriculum_progress')
        .upsert({
          user_id: user.id,
          curriculum_id: curriculumId,
          active_module_id: moduleId,
          active_course_id: courseId,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['curriculum-progress', curriculumId] 
      });
      toast({
        title: "Progress Updated",
        description: "Your progress has been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress,
  };
};
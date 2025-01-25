import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { decryptData } from "@/lib/encryption";
import type { Curriculum } from "@/types/curriculum";
import { useToast } from "@/hooks/use-toast";

export const useCurriculum = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: curricula, isLoading } = useQuery({
    queryKey: ['curricula'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('imported_curricula')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(curr => ({
        ...curr,
        curriculum: JSON.parse(decryptData(curr.curriculum))
      }));
    },
  });

  const importCurriculum = useMutation({
    mutationFn: async (curriculum: Curriculum) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('imported_curricula')
        .insert({
          user_id: user.id,
          curriculum: JSON.stringify(curriculum),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    },
  });

  const deleteCurriculum = useMutation({
    mutationFn: async (curriculumId: string) => {
      const { error } = await supabase
        .from('imported_curricula')
        .delete()
        .eq('id', curriculumId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast({
        title: "Success",
        description: "Curriculum deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete curriculum",
        variant: "destructive",
      });
    },
  });

  return {
    curricula,
    isLoading,
    importCurriculum,
    deleteCurriculum,
  };
};
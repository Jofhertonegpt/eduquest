import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curriculumTemplateService, CurriculumTemplate } from '@/services/curriculumTemplateService';
import { toast } from '@/hooks/use-toast';

export function useCurriculumTemplates() {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['curriculum-templates'],
    queryFn: curriculumTemplateService.getTemplates,
  });

  const { mutate: createTemplate } = useMutation({
    mutationFn: curriculumTemplateService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum-templates'] });
      toast({
        title: "Template Created",
        description: "Your curriculum template has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create template: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    templates,
    isLoading,
    createTemplate,
  };
}
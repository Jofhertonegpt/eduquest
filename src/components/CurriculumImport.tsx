import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { defaultProgram } from "@/data/program";
import { defaultCourses } from "@/data/curriculum/New defaults/courses";

export const CurriculumImport = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleImportDefault = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const template = {
        user_id: user.id,
        name: defaultProgram.name,
        description: defaultProgram.description,
        template_type: 'program',
        content: {
          name: defaultProgram.name,
          description: defaultProgram.description,
          programOutcomes: defaultProgram.programOutcomes,
          institution: defaultProgram.institution,
          complianceStandards: defaultProgram.complianceStandards,
          degrees: defaultProgram.degrees.map(degree => ({
            id: degree.id,
            title: degree.title,
            type: degree.type,
            description: degree.description,
            requiredCredits: degree.requiredCredits,
            metadata: degree.metadata,
            courses: degree.courses
          }))
        },
        is_default: true,
      };

      const { error } = await supabase
        .from('curriculum_templates')
        .insert(template);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default curriculum template imported successfully",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import curriculum template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Import Curriculum</h2>
      <button
        onClick={handleImportDefault}
        disabled={isLoading}
        className="mt-4 btn"
      >
        {isLoading ? "Importing..." : "Import Default Curriculum"}
      </button>
    </div>
  );
};
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import type { CodingQuestion } from "@/types/curriculum";
import programData from "@/data/curriculum/New defaults/program.json";
import coursesData from "@/data/curriculum/New defaults/courses.json";
import modulesData from "@/data/curriculum/New defaults/modules.json";

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
        name: programData.name,
        description: programData.description,
        template_type: 'program',
          content: {
            ...programData,
            courses: coursesData.map(course => ({
              ...course,
              modules: course.modules.map(moduleId => {
                const module = modulesData.find(m => m.id === moduleId);
                if (module) {
                  // Add a test coding question to the first quiz
                  if (module.quizzes && module.quizzes.length > 0) {
                    const codingQuestion: CodingQuestion = {
                      id: 'test-coding-q1',
                      type: 'coding',
                      title: 'Test Coding Question',
                      description: 'Write a function that returns "Hello World"',
                      points: 10,
                      initialCode: 'function helloWorld() {\n  // Your code here\n}',
                      testCases: [{
                        input: '',
                        expectedOutput: 'Hello World'
                      }]
                    };
                    module.quizzes[0].questions.push(codingQuestion);
                  }
                  return module;
                }
                return null;
              }).filter(Boolean)
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
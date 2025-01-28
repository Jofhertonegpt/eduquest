import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { supabase } from "@/lib/supabase";
import defaultProgram from "@/data/curriculum/New defaults/program.json";
import defaultCourses from "@/data/curriculum/New defaults/courses.json";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ImportStepContent } from "./curriculum/ImportStepContent";
import { ImportStepNavigation } from "./curriculum/ImportStepNavigation";
import { ImportProgress } from "./curriculum/ImportProgress";
import type { JsonInputs } from "@/types/curriculum";

const jsonPlaceholders = {
  curriculum: `{
  "name": "Program Name",
  "description": "Program Description",
  "degrees": [
    {
      "id": "degree-id",
      "title": "Degree Title",
      "type": "certificate",
      "description": "Degree Description",
      "requiredCredits": 12,
      "courses": ["course-id"]
    }
  ]
}`,
  courses: `[
  {
    "id": "course-id",
    "title": "Course Title",
    "description": "Course Description",
    "credits": 3
  }
]`,
  modules: `[
  {
    "id": "module-id",
    "title": "Module Title",
    "description": "Module Description",
    "metadata": {
      "estimatedTime": 120,
      "difficulty": "beginner"
    }
  }
]`
};

export function CurriculumImport() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInputs, setJsonInputs] = useState<JsonInputs>({
    curriculum: "",
    courses: "",
    modules: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleInputChange = (field: keyof JsonInputs, value: string) => {
    setJsonInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImport = async (useDefault?: boolean) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to import a curriculum",
          variant: "destructive",
        });
        navigate("/login", { state: { returnTo: "/import" } });
        return;
      }

      setIsLoading(true);
      
      let dataToImport;
      if (useDefault) {
        dataToImport = {
          ...defaultProgram,
          courses: defaultCourses,
        };
      } else {
        dataToImport = {
          ...JSON.parse(jsonInputs.curriculum || "{}"),
          courses: JSON.parse(jsonInputs.courses || "[]"),
          modules: JSON.parse(jsonInputs.modules || "[]"),
        };
      }

      const validatedCurriculum = validateAndTransformCurriculum(dataToImport);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("imported_curricula")
        .insert({
          user_id: user.id,
          curriculum: validatedCurriculum,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });

      navigate(`/learning/${data.id}`);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Import Curriculum</h2>
          <CurriculumFormatInfo />
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Follow the step-by-step process to import your curriculum. Each step contains a template with required fields.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <ImportProgress currentStep={currentStep} totalSteps={3} />

          <ImportStepContent
            currentStep={currentStep}
            jsonInputs={jsonInputs}
            jsonPlaceholders={jsonPlaceholders}
            onInputChange={handleInputChange}
          />

          <ImportStepNavigation
            currentStep={currentStep}
            isLoading={isLoading}
            hasRequiredInput={!!jsonInputs.curriculum}
            onPrevious={prevStep}
            onNext={nextStep}
            onImport={handleImport}
          />
        </div>
      </div>
    </Card>
  );
}

export default CurriculumImport;

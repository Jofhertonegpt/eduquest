import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { supabase } from "@/lib/supabase";
import defaultProgram from "@/data/curriculum/New defaults/program.json";
import defaultCourses from "@/data/curriculum/New defaults/courses.json";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import type { Json } from "@/lib/database.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface JsonInputs {
  curriculum: string;
  courses: string;
  modules: string;
}

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

      const curriculumJson = JSON.parse(JSON.stringify(validatedCurriculum)) as Json;

      const { data, error } = await supabase
        .from("imported_curricula")
        .insert({
          user_id: user.id,
          curriculum: curriculumJson,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="curriculum-json">Program Structure</Label>
            <Textarea
              id="curriculum-json"
              placeholder={jsonPlaceholders.curriculum}
              value={jsonInputs.curriculum}
              onChange={(e) => handleInputChange("curriculum", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="courses-json">Course Definitions</Label>
            <Textarea
              id="courses-json"
              placeholder={jsonPlaceholders.courses}
              value={jsonInputs.courses}
              onChange={(e) => handleInputChange("courses", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="modules-json">Module Details</Label>
            <Textarea
              id="modules-json"
              placeholder={jsonPlaceholders.modules}
              value={jsonInputs.modules}
              onChange={(e) => handleInputChange("modules", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>

          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => handleImport(true)}
                variant="secondary"
                disabled={isLoading}
              >
                Use Default
              </Button>

              {currentStep === 3 ? (
                <Button
                  onClick={() => handleImport()}
                  disabled={isLoading || !jsonInputs.curriculum}
                  className="flex items-center gap-2"
                >
                  {isLoading ? "Importing..." : "Import Curriculum"}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CurriculumImport;
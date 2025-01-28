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
import { ImportErrorBoundary } from "./import/ImportErrorBoundary";
import type { Json } from "@/lib/database.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface JsonInputs {
  curriculum: string;
  courses: string;
  modules: string;
}

interface ValidationError {
  field: keyof JsonInputs;
  message: string;
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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [stepProgress, setStepProgress] = useState(0);
  const [jsonInputs, setJsonInputs] = useState<JsonInputs>({
    curriculum: "",
    courses: "",
    modules: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check failed:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const validateStep = (step: number): boolean => {
    setValidationErrors([]);
    const errors: ValidationError[] = [];

    switch (step) {
      case 1:
        if (!jsonInputs.curriculum.trim()) {
          errors.push({ field: 'curriculum', message: 'Curriculum data is required' });
        } else {
          try {
            JSON.parse(jsonInputs.curriculum);
          } catch (e) {
            errors.push({ field: 'curriculum', message: 'Invalid JSON format' });
          }
        }
        break;
      case 2:
        if (!jsonInputs.courses.trim()) {
          errors.push({ field: 'courses', message: 'Course data is required' });
        } else {
          try {
            JSON.parse(jsonInputs.courses);
          } catch (e) {
            errors.push({ field: 'courses', message: 'Invalid JSON format' });
          }
        }
        break;
      case 3:
        if (jsonInputs.modules.trim()) {
          try {
            JSON.parse(jsonInputs.modules);
          } catch (e) {
            errors.push({ field: 'modules', message: 'Invalid JSON format' });
          }
        }
        break;
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: keyof JsonInputs, value: string) => {
    setJsonInputs(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation errors when user starts typing
    setValidationErrors(prev => prev.filter(error => error.field !== field));
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
      setStepProgress(25);
      
      let dataToImport;
      if (useDefault) {
        dataToImport = {
          ...defaultProgram,
          courses: defaultCourses,
        };
      } else {
        if (!validateStep(3)) {
          setIsLoading(false);
          return;
        }
        
        dataToImport = {
          ...JSON.parse(jsonInputs.curriculum || "{}"),
          courses: JSON.parse(jsonInputs.courses || "[]"),
          modules: JSON.parse(jsonInputs.modules || "[]"),
        };
      }

      setStepProgress(50);
      const validatedCurriculum = validateAndTransformCurriculum(dataToImport);
      setStepProgress(75);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Authentication failed");

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

      if (error) {
        throw new Error(`Failed to import curriculum: ${error.message}`);
      }

      setStepProgress(100);
      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });

      navigate(`/learning/${data.id}`);
    } catch (error) {
      console.error("Import error:", error);
      setStepProgress(0);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    const currentErrors = validationErrors.filter(error => 
      error.field === Object.keys(jsonInputs)[currentStep - 1] as keyof JsonInputs
    );

    const renderField = (field: keyof JsonInputs, label: string) => (
      <div className="space-y-2">
        <Label htmlFor={`${field}-json`}>{label}</Label>
        <Textarea
          id={`${field}-json`}
          placeholder={jsonPlaceholders[field]}
          value={jsonInputs[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`min-h-[300px] font-mono ${currentErrors.length ? 'border-red-500' : ''}`}
        />
        {currentErrors.map((error, index) => (
          <p key={index} className="text-sm text-red-500 mt-1">
            {error.message}
          </p>
        ))}
      </div>
    );

    switch (currentStep) {
      case 1:
        return renderField('curriculum', 'Program Structure');
      case 2:
        return renderField('courses', 'Course Definitions');
      case 3:
        return renderField('modules', 'Module Details');
      default:
        return null;
    }
  };

  return (
    <ImportErrorBoundary>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Import Curriculum</h2>
            <CurriculumFormatInfo />
          </div>

          <Alert>
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
              <Progress 
                value={isLoading ? stepProgress : (currentStep / 3) * 100} 
                className="h-2"
              />
            </div>

            {renderStepContent()}

            <div className="flex justify-between pt-4">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1 || isLoading}
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
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Use Default'
                  )}
                </Button>

                {currentStep === 3 ? (
                  <Button
                    onClick={() => handleImport()}
                    disabled={isLoading || !jsonInputs.curriculum}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import Curriculum'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ImportErrorBoundary>
  );
}

export default CurriculumImport;

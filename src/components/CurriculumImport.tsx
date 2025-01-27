import { useState } from "react";
import { Upload, FileJson, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Curriculum } from "@/types/curriculum";

interface Props {
  onImport: (curriculum: Curriculum) => void;
}

interface ValidationResult {
  isValid: boolean;
  details: {
    courses: number;
    modules: number;
    assignments: number;
    quizzes: number;
  };
  errors: string[];
}

const CurriculumImport = ({ onImport }: Props) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationProgress, setValidationProgress] = useState(0);

  const validateCurriculum = (data: any): ValidationResult => {
    const errors: string[] = [];
    const details = {
      courses: 0,
      modules: 0,
      assignments: 0,
      quizzes: 0,
    };

    // Basic structure validation
    if (!data.name) errors.push("Missing curriculum name");
    if (!data.description) errors.push("Missing curriculum description");
    if (!Array.isArray(data.degrees)) errors.push("Missing or invalid degrees array");

    // Count items and validate structure
    data.degrees?.forEach((degree: any, degreeIndex: number) => {
      if (!degree.courses) {
        errors.push(`Degree at index ${degreeIndex} is missing courses`);
        return;
      }

      degree.courses.forEach((course: any) => {
        details.courses++;
        
        course.modules?.forEach((module: any) => {
          details.modules++;
          details.assignments += module.assignments?.length || 0;
          details.quizzes += module.quizzes?.length || 0;

          // Validate module structure
          if (!module.learningObjectives?.length) {
            errors.push(`Module "${module.title}" is missing learning objectives`);
          }
        });
      });
    });

    return {
      isValid: errors.length === 0,
      details,
      errors,
    };
  };

  const handleFileImport = async (file: File) => {
    try {
      setIsValidating(true);
      setValidationProgress(0);
      
      // Read file content
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      setValidationProgress(30);
      const rawCurriculum = JSON.parse(text);
      
      // Validate curriculum structure
      setValidationProgress(60);
      const validation = validateCurriculum(rawCurriculum);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        toast({
          title: "Validation Failed",
          description: "Please fix the errors and try again",
          variant: "destructive",
        });
        return;
      }

      setValidationProgress(80);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Save to Supabase
      const { data: savedCurriculum, error: saveError } = await supabase
        .from('imported_curricula')
        .insert({
          user_id: user.id,
          curriculum: rawCurriculum,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setValidationProgress(100);
      onImport(rawCurriculum);
      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      handleFileImport(file);
    } else {
      toast({
        title: "Error",
        description: "Please provide a JSON file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {isValidating ? (
          <div className="space-y-4">
            <div className="w-full max-w-xs mx-auto space-y-2">
              <Progress value={validationProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Validating curriculum...
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Import Curriculum</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your JSON curriculum file here
            </p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileImport(file);
              }}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              Select File
            </Button>
          </>
        )}
      </div>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              Validation Results
            </CardTitle>
            <CardDescription>
              {validationResult.isValid 
                ? "Your curriculum file is valid and ready to import"
                : "Please fix the following issues before importing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validationResult.isValid ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Courses</p>
                  <p className="text-2xl font-bold">{validationResult.details.courses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Modules</p>
                  <p className="text-2xl font-bold">{validationResult.details.modules}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Assignments</p>
                  <p className="text-2xl font-bold">{validationResult.details.assignments}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Quizzes</p>
                  <p className="text-2xl font-bold">{validationResult.details.quizzes}</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {validationResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-red-500"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurriculumImport;
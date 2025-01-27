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

interface CurriculumFiles {
  program?: any;
  courses?: any;
  modules?: any;
  resources?: any;
  assignments?: any;
  quizzes?: any;
}

const CurriculumImport = ({ onImport }: Props) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationProgress, setValidationProgress] = useState(0);
  const [curriculumFiles, setCurriculumFiles] = useState<CurriculumFiles>({});

  const validateCurriculum = (files: CurriculumFiles): ValidationResult => {
    const errors: string[] = [];
    const details = {
      courses: 0,
      modules: 0,
      assignments: 0,
      quizzes: 0,
    };

    // Check if all required files are present
    if (!files.program) errors.push("Missing program.json file");
    if (!files.courses) errors.push("Missing courses.json file");
    if (!files.modules) errors.push("Missing modules.json file");
    if (!files.resources) errors.push("Missing resources.json file");
    if (!files.assignments) errors.push("Missing assignments.json file");
    if (!files.quizzes) errors.push("Missing quizzes.json file");

    if (errors.length > 0) return { isValid: false, details, errors };

    // Validate program structure
    if (!files.program.name) errors.push("Missing program name");
    if (!files.program.description) errors.push("Missing program description");
    if (!Array.isArray(files.program.degrees)) errors.push("Missing or invalid degrees array");

    // Count and validate courses
    if (Array.isArray(files.courses)) {
      details.courses = files.courses.length;
      files.courses.forEach((course: any, index: number) => {
        if (!course.title) errors.push(`Course at index ${index} is missing title`);
        if (!course.modules) errors.push(`Course at index ${index} is missing modules`);
      });
    }

    // Count and validate modules
    if (Array.isArray(files.modules)) {
      details.modules = files.modules.length;
      files.modules.forEach((module: any, index: number) => {
        if (!module.title) errors.push(`Module at index ${index} is missing title`);
        if (!module.learningObjectives?.length) {
          errors.push(`Module "${module.title}" is missing learning objectives`);
        }
      });
    }

    // Count assignments and quizzes
    details.assignments = Array.isArray(files.assignments) ? files.assignments.length : 0;
    details.quizzes = Array.isArray(files.quizzes) ? files.quizzes.length : 0;

    return {
      isValid: errors.length === 0,
      details,
      errors,
    };
  };

  const handleFileImport = async (importedFiles: FileList) => {
    try {
      setIsValidating(true);
      setValidationProgress(0);
      
      const newCurriculumFiles: CurriculumFiles = {};
      
      // Read all files
      for (let i = 0; i < importedFiles.length; i++) {
        const file = importedFiles[i];
        if (!file.name.endsWith('.json')) {
          toast({
            title: "Invalid File",
            description: `${file.name} is not a JSON file`,
            variant: "destructive",
          });
          continue;
        }

        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        const fileType = file.name.replace('.json', '').toLowerCase();
        newCurriculumFiles[fileType as keyof CurriculumFiles] = JSON.parse(text);
        setValidationProgress((i + 1) * (30 / importedFiles.length));
      }

      setCurriculumFiles(newCurriculumFiles);
      
      // Validate curriculum structure
      setValidationProgress(60);
      const validation = validateCurriculum(newCurriculumFiles);
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

      // Combine all files into a single curriculum object
      const combinedCurriculum = {
        ...newCurriculumFiles.program,
        courses: newCurriculumFiles.courses.map((course: any) => ({
          ...course,
          modules: course.modules.map((moduleId: string) => {
            const moduleData = newCurriculumFiles.modules.find((m: any) => m.id === moduleId);
            if (!moduleData) return null;
            return {
              ...moduleData,
              resources: moduleData.resources?.map((rid: string) => 
                newCurriculumFiles.resources.find((r: any) => r.id === rid)
              ).filter(Boolean),
              assignments: moduleData.assignments?.map((aid: string) =>
                newCurriculumFiles.assignments.find((a: any) => a.id === aid)
              ).filter(Boolean),
              quizzes: moduleData.quizzes?.map((qid: string) =>
                newCurriculumFiles.quizzes.find((q: any) => q.id === qid)
              ).filter(Boolean),
            };
          }).filter(Boolean),
        })),
      };

      // Save to Supabase
      const { data: savedCurriculum, error: saveError } = await supabase
        .from('imported_curricula')
        .insert({
          user_id: user.id,
          curriculum: combinedCurriculum,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setValidationProgress(100);
      onImport(combinedCurriculum);
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileImport(files);
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
                Validating curriculum files...
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Import Curriculum Files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your curriculum JSON files here (program.json, courses.json, etc.)
            </p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              multiple
              accept="application/json"
              onChange={(e) => {
                if (e.target.files?.length) handleFileImport(e.target.files);
              }}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              Select Files
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
                ? "Your curriculum files are valid and ready to import"
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
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Curriculum } from "@/types/curriculum";

interface Props {
  onImport: (curriculum: Curriculum) => void;
}

interface FileState {
  file: File | null;
  isValid: boolean;
  error?: string;
}

interface CurriculumFiles {
  program: FileState;
  courses: FileState;
  modules: FileState;
  resources: FileState;
  assignments: FileState;
  quizzes: FileState;
}

const initialFileState: FileState = {
  file: null,
  isValid: false,
};

export function CurriculumImport({ onImport }: Props) {
  const { toast } = useToast();
  const [files, setFiles] = useState<CurriculumFiles>({
    program: initialFileState,
    courses: initialFileState,
    modules: initialFileState,
    resources: initialFileState,
    assignments: initialFileState,
    quizzes: initialFileState,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDrop = (fileType: keyof CurriculumFiles) => async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      await validateAndSetFile(fileType, file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please provide a JSON file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (fileType: keyof CurriculumFiles) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await validateAndSetFile(fileType, file);
    }
  };

  const validateAndSetFile = async (fileType: keyof CurriculumFiles, file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      setFiles(prev => ({
        ...prev,
        [fileType]: {
          file,
          isValid: true,
        }
      }));
    } catch (error) {
      setFiles(prev => ({
        ...prev,
        [fileType]: {
          file: null,
          isValid: false,
          error: "Invalid JSON file"
        }
      }));
      toast({
        title: "Invalid JSON",
        description: "The file contains invalid JSON data",
        variant: "destructive",
      });
    }
  };

  const renderFileUpload = (fileType: keyof CurriculumFiles, label: string) => {
    const fileState = files[fileType];
    return (
      <TooltipProvider>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 mb-4 transition-colors ${
            fileState.file ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop(fileType)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{label}</span>
            </div>
            {fileState.file ? (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600">{fileState.file.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>File uploaded successfully</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles(prev => ({
                    ...prev,
                    [fileType]: initialFileState
                  }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id={`file-${fileType}`}
                  className="hidden"
                  accept="application/json"
                  onChange={handleFileSelect(fileType)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`file-${fileType}`)?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  const handleImport = async () => {
    setIsUploading(true);
    try {
      const combinedCurriculum = {
        program: files.program.file,
        courses: files.courses.file,
        modules: files.modules.file,
        resources: files.resources.file,
        assignments: files.assignments.file,
        quizzes: files.quizzes.file,
      };

      const { data: savedCurriculum, error: saveError } = await supabase
        .from('imported_curricula')
        .insert({
          curriculum: combinedCurriculum,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saveError) throw saveError;

      onImport(savedCurriculum);
      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const allFilesUploaded = Object.values(files).every(f => f.file && f.isValid);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Curriculum Files</CardTitle>
          <CardDescription>
            Upload each required JSON file for your curriculum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderFileUpload('program', 'Program File (program.json)')}
          {renderFileUpload('courses', 'Courses File (courses.json)')}
          {renderFileUpload('modules', 'Modules File (modules.json)')}
          {renderFileUpload('resources', 'Resources File (resources.json)')}
          {renderFileUpload('assignments', 'Assignments File (assignments.json)')}
          {renderFileUpload('quizzes', 'Quizzes File (quizzes.json)')}
          
          <Button
            className="w-full"
            disabled={!allFilesUploaded || isUploading}
            onClick={handleImport}
          >
            {isUploading ? 'Importing...' : 'Import Curriculum'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default CurriculumImport;
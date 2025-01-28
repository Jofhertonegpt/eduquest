import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditor } from "@/components/code-editor/MonacoEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import type { Program, Course, Module, CodingQuestion, MultipleChoiceQuestion } from "@/types/curriculum";
import programData from "@/data/curriculum/New defaults/program.json";
import coursesData from "@/data/curriculum/New defaults/courses.json";
import modulesData from "@/data/curriculum/New defaults/modules.json";

interface FileUpload {
  name: string;
  content: string;
}

export const CurriculumImport = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<Record<string, FileUpload>>({});
  const [previewContent, setPreviewContent] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      JSON.parse(content); // Validate JSON
      setFiles(prev => ({
        ...prev,
        [fileType]: { name: file.name, content }
      }));
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been validated and is ready for import.`,
      });
    } catch (error) {
      toast({
        title: "Invalid JSON file",
        description: "Please ensure the file contains valid JSON data.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (fileType: string) => {
    const file = files[fileType];
    if (!file) return;
    
    try {
      const formatted = JSON.stringify(JSON.parse(file.content), null, 2);
      setPreviewContent(formatted);
    } catch (error) {
      setPreviewContent('Invalid JSON content');
    }
  };

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
                if (module.quizzes && module.quizzes.length > 0) {
                  const mcQuestion: MultipleChoiceQuestion = {
                    id: 'test-mc-q1',
                    type: 'multiple-choice',
                    title: 'Test Multiple Choice',
                    description: 'What is the output of console.log("Hello World")?',
                    points: 5,
                    options: ['"Hello World"', 'undefined', 'null', 'Error'],
                    correctAnswer: 0
                  };

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

                  module.quizzes[0].questions = [mcQuestion, codingQuestion];
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

  const handleImportCustom = async () => {
    if (!files.program || !files.courses || !files.modules) {
      toast({
        title: "Missing files",
        description: "Please upload all required JSON files.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const program = JSON.parse(files.program.content);
      const courses = JSON.parse(files.courses.content);
      const modules = JSON.parse(files.modules.content);

      // Validate against schema
      const validatedContent = validateAndTransformCurriculum({
        program,
        courses,
        modules
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const template = {
        user_id: user.id,
        name: program.name,
        description: program.description,
        template_type: 'program',
        content: validatedContent,
        is_default: false,
      };

      const { error } = await supabase
        .from('curriculum_templates')
        .insert(template);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom curriculum template imported successfully",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Tabs defaultValue="custom">
        <TabsList className="mb-8">
          <TabsTrigger value="custom">Custom Import</TabsTrigger>
          <TabsTrigger value="default">Default Curriculum</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Import Custom Curriculum</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Program JSON</label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, 'program')}
                  className="mb-2"
                />
                {files.program && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview('program')}
                  >
                    Preview
                  </Button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Courses JSON</label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, 'courses')}
                  className="mb-2"
                />
                {files.courses && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview('courses')}
                  >
                    Preview
                  </Button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Modules JSON</label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, 'modules')}
                  className="mb-2"
                />
                {files.modules && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview('modules')}
                  >
                    Preview
                  </Button>
                )}
              </div>
            </div>

            {previewContent && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <div className="h-[400px] border rounded-lg overflow-hidden">
                  <MonacoEditor
                    initialValue={previewContent}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleImportCustom}
                disabled={isLoading || !files.program || !files.courses || !files.modules}
                className="flex-1"
              >
                {isLoading ? "Importing..." : "Import Custom Curriculum"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/jofh-school'}
                className="flex-1"
              >
                View Default Curriculum
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="default">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Import Default Curriculum</h2>
            <p className="text-gray-600 mb-8">
              Import the default curriculum template with pre-configured courses, modules, and example questions.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleImportDefault}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Importing..." : "Import Default Curriculum"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/jofh-school'}
                className="flex-1"
              >
                View Default Curriculum
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
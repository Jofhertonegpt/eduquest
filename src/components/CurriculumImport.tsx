import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CurriculumTemplateList } from "./curriculum/CurriculumTemplateList";
import { useCurriculumTemplates } from "@/hooks/useCurriculumTemplates";
import { FileUp, Loader2 } from "lucide-react";
import defaultProgram from "@/data/curriculum/New defaults/program.json";
import defaultCourses from "@/data/curriculum/New defaults/courses.json";

export function CurriculumImport() {
  const [isLoading, setIsLoading] = useState(false);
  const { createTemplate } = useCurriculumTemplates();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImportDefaults = useCallback(async () => {
    try {
      setIsLoading(true);
      await createTemplate({
        name: defaultProgram.name,
        description: defaultProgram.description,
        template_type: 'program',
        content: {
          ...defaultProgram,
          courses: defaultCourses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            credits: course.credits,
            level: course.level,
            metadata: course.metadata,
            modules: course.modules || []
          }))
        },
        is_default: true,
      });
      
      navigate('/learning');
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import default curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [createTemplate, navigate, toast]);

  return (
    <Card className="p-6">
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="import">Import New</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <CurriculumTemplateList />
        </TabsContent>

        <TabsContent value="import">
          <div className="text-center space-y-4 mb-8">
            <FileUp className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">Import Your Curriculum</h2>
              <p className="text-sm text-muted-foreground">
                Use our default curriculum or import your own
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleImportDefaults} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Use Default Curriculum'
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default CurriculumImport;
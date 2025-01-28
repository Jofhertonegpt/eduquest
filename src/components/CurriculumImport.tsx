import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { supabase } from "@/lib/supabase";
import defaultCurriculum from "@/data/curriculum/program.json";
import defaultCourses from "@/data/curriculum/courses.json";
import defaultModules from "@/data/curriculum/modules.json";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import type { Json } from "@/lib/database.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
          ...defaultCurriculum,
          courses: defaultCourses,
          modules: defaultModules,
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

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Import Curriculum</h2>
          <CurriculumFormatInfo />
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Each tab contains a minimal template with required fields. Additional fields can be added as needed.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          {Object.keys(jsonInputs).map((key) => (
            <TabsContent key={key} value={key} className="space-y-2">
              <Label htmlFor={`${key}-json`} className="capitalize">{key} JSON</Label>
              <Textarea
                id={`${key}-json`}
                placeholder={jsonPlaceholders[key as keyof JsonInputs]}
                value={jsonInputs[key as keyof JsonInputs]}
                onChange={(e) => handleInputChange(key as keyof JsonInputs, e.target.value)}
                className="min-h-[400px] font-mono"
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex gap-4">
          <Button 
            onClick={() => handleImport()} 
            disabled={isLoading || !jsonInputs.curriculum}
            className="flex-1"
          >
            {isLoading ? "Importing..." : "Import Custom Curriculum"}
          </Button>
          <Button 
            onClick={() => handleImport(true)}
            disabled={isLoading}
            variant="secondary"
            className="flex-1"
          >
            Use Default Curriculum
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CurriculumImport;
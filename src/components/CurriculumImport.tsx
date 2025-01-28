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
import defaultQuizzes from "@/data/curriculum/quizzes.json";
import defaultAssignments from "@/data/curriculum/assignments.json";
import defaultResources from "@/data/curriculum/resources.json";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import type { Json } from "@/lib/database.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface JsonInputs {
  curriculum: string;
  courses: string;
  modules: string;
  quizzes: string;
  assignments: string;
  resources: string;
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
    "credits": 3,
    "level": "introductory",
    "modules": ["module-id"]
  }
]`,
  modules: `[
  {
    "id": "module-id",
    "title": "Module Title",
    "description": "Module Description",
    "credits": 1,
    "metadata": {
      "estimatedTime": 120,
      "difficulty": "beginner",
      "prerequisites": [],
      "tags": ["tag1"],
      "skills": ["skill1"]
    },
    "learningObjectives": [
      {
        "id": "obj-1",
        "description": "Objective Description",
        "assessmentCriteria": ["Criteria 1"]
      }
    ]
  }
]`,
  quizzes: `[
  {
    "id": "quiz-id",
    "title": "Quiz Title",
    "description": "Quiz Description",
    "questions": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "title": "Question Title",
        "description": "Question Description",
        "points": 5,
        "options": ["Option 1", "Option 2"],
        "correctAnswer": 0
      }
    ]
  }
]`,
  assignments: `[
  {
    "id": "assignment-id",
    "title": "Assignment Title",
    "description": "Assignment Description",
    "dueDate": "2024-12-31",
    "points": 100,
    "questions": [
      {
        "id": "q1",
        "type": "coding",
        "title": "Question Title",
        "description": "Question Description",
        "points": 50,
        "initialCode": "// Your code here"
      }
    ]
  }
]`,
  resources: `[
  {
    "id": "resource-id",
    "title": "Resource Title",
    "type": "video",
    "content": "Resource Content",
    "duration": "30 minutes",
    "url": "https://example.com/resource",
    "embedType": "youtube"
  }
]`
};

export function CurriculumImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInputs, setJsonInputs] = useState<JsonInputs>({
    curriculum: "",
    courses: "",
    modules: "",
    quizzes: "",
    assignments: "",
    resources: "",
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

  const mergeCurriculumData = () => {
    try {
      const curriculumData = jsonInputs.curriculum ? JSON.parse(jsonInputs.curriculum) : {};
      const coursesData = jsonInputs.courses ? JSON.parse(jsonInputs.courses) : [];
      const modulesData = jsonInputs.modules ? JSON.parse(jsonInputs.modules) : [];
      const quizzesData = jsonInputs.quizzes ? JSON.parse(jsonInputs.quizzes) : [];
      const assignmentsData = jsonInputs.assignments ? JSON.parse(jsonInputs.assignments) : [];
      const resourcesData = jsonInputs.resources ? JSON.parse(jsonInputs.resources) : [];

      console.log("Merged curriculum data:", {
        ...curriculumData,
        courses: coursesData,
        modules: modulesData,
        quizzes: quizzesData,
        assignments: assignmentsData,
        resources: resourcesData,
      });

      return {
        ...curriculumData,
        courses: coursesData,
        modules: modulesData,
        quizzes: quizzesData,
        assignments: assignmentsData,
        resources: resourcesData,
      };
    } catch (error) {
      console.error("Error merging curriculum data:", error);
      throw new Error("Invalid JSON format in one or more inputs");
    }
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
          quizzes: defaultQuizzes,
          assignments: defaultAssignments,
          resources: defaultResources,
        };
        console.log("Using default curriculum:", dataToImport);
      } else {
        dataToImport = mergeCurriculumData();
      }

      const validatedCurriculum = validateAndTransformCurriculum(dataToImport);
      console.log("Validated curriculum:", validatedCurriculum);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Convert the curriculum to a plain object that matches the Json type
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
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Imported curriculum data:", data);

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
            Each tab below contains a template for the required JSON structure. You can modify these templates or paste your own JSON data.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
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
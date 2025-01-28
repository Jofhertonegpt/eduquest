import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import defaultCurriculum from "@/data/curriculum/program.json";
import defaultCourses from "@/data/curriculum/courses.json";
import defaultModules from "@/data/curriculum/modules.json";
import defaultQuizzes from "@/data/curriculum/quizzes.json";
import defaultAssignments from "@/data/curriculum/assignments.json";
import defaultResources from "@/data/curriculum/resources.json";

export function CurriculumFormatInfo() {
  const { toast } = useToast();

  const copyExampleFormat = (data: any, type: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({
      title: "Copied to clipboard",
      description: `${type} format has been copied to your clipboard.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
          <span className="sr-only">Curriculum Format Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Curriculum Format Guide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Required Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">[Required] JSON Structure</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your curriculum must include the following JSON files, each with specific required fields:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="font-semibold">Program JSON:</span>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                    <li>name (string)</li>
                    <li>description (string)</li>
                    <li>degrees (array of degree objects)</li>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => copyExampleFormat(defaultCurriculum, "Program")}
                      className="ml-2"
                    >
                      Copy example
                    </Button>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Courses JSON:</span>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                    <li>id (string)</li>
                    <li>title (string)</li>
                    <li>description (string)</li>
                    <li>credits (number)</li>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => copyExampleFormat(defaultCourses, "Courses")}
                      className="ml-2"
                    >
                      Copy example
                    </Button>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Modules JSON:</span>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                    <li>id (string)</li>
                    <li>title (string)</li>
                    <li>description (string)</li>
                    <li>metadata (object)</li>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => copyExampleFormat(defaultModules, "Modules")}
                      className="ml-2"
                    >
                      Copy example
                    </Button>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          {/* Working Example Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">[Working Example]</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Here's a complete working example that you can use as a reference:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify({
                    name: "Web Development 101",
                    description: "Introduction to web development",
                    degrees: [{
                      id: "web-dev-cert",
                      title: "Web Development Certificate",
                      type: "certificate",
                      description: "Learn web development basics",
                      requiredCredits: 12,
                      courses: ["html-basics"]
                    }]
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </section>

          {/* How to Create Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">[How to Create Your Own Curriculum]</h3>
            <div className="space-y-4">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <p className="font-medium">Start with Program Structure</p>
                  <p className="text-sm text-muted-foreground">
                    Create your program JSON first, defining the overall structure and degrees offered.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Define Your Courses</p>
                  <p className="text-sm text-muted-foreground">
                    Create course definitions that will be referenced by your degrees.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Create Detailed Modules</p>
                  <p className="text-sm text-muted-foreground">
                    Break down each course into specific learning modules.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Add Assessments</p>
                  <p className="text-sm text-muted-foreground">
                    Create quizzes and assignments for each module.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Include Learning Resources</p>
                  <p className="text-sm text-muted-foreground">
                    Add supporting materials like videos, documents, or links.
                  </p>
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Pro Tips:</h4>
                <ul className="list-disc pl-4 space-y-2 text-sm">
                  <li>Use unique IDs across all your JSON files</li>
                  <li>Ensure all referenced IDs exist in their respective files</li>
                  <li>Validate your JSON before importing</li>
                  <li>Start small and gradually add more content</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}